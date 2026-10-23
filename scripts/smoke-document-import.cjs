const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const JSZip = require('jszip');
const { app, dialog } = require('electron');
app.on('window-all-closed', () => undefined);
function pdf(text) {
  const stream = text ? `BT /F1 12 Tf 50 750 Td (${text}) Tj ET` : '';
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`];
  let result = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((object, i) => { offsets.push(Buffer.byteLength(result)); result += `${i + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(result);
  result += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => String(offset).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(result);
}
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'resume-document-import-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = path.join(directory, 'data');
  process.env.INTERVIEW_COPILOT_REFERENCE_DIR = path.join(directory, 'reference');
  const overlay = require('../dist/main/services/overlayService');
  try {
    const zip = new JSZip();
    zip.file('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
    zip.file('_rels/.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
    zip.file('word/document.xml', '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Resume fixture: backend engineer at Example Labs.</w:t></w:r></w:p><w:tbl><w:tr><w:tc><w:p><w:r><w:t>TypeScript billing APIs</w:t></w:r></w:p></w:tc></w:tr></w:tbl></w:body></w:document>');
    const docx = path.join(directory, 'candidate_resume.docx');
    const documentBytes = await zip.generateAsync({type: 'nodebuffer'});
    await fs.writeFile(docx, documentBytes);
    const pdfFile = path.join(directory, 'project_resume.pdf');
    await fs.writeFile(pdfFile, pdf('Resume fixture: Redis caching project at Example Labs.'));
    const blank = path.join(directory, 'blank_resume.pdf');
    await fs.writeFile(blank, pdf(''));
    const invalid = path.join(directory, 'broken.pdf'); await fs.writeFile(invalid, 'not a PDF');
    const oldWord = path.join(directory, 'old.doc'); await fs.writeFile(oldWord, 'not supported');
    const knowledge = require('../dist/main/services/knowledgeService');
    await assert.rejects(knowledge.importNote(oldWord), /save a .docx copy/);
    dialog.showOpenDialog = async options => {
      assert.deepEqual(options.filters[0].extensions, ['txt', 'md', 'docx', 'pdf']);
      return {canceled: false, filePaths: [docx, pdfFile, blank, invalid]};
    };
    require('../dist/main/ipc').registerIpcHandlers();
    const floating = overlay.createOverlayWindow();
    if (floating.webContents.isLoading()) await new Promise(resolve => floating.webContents.once('did-finish-load', resolve));
    const run = code => floating.webContents.executeJavaScript(code);
    const until = async code => { for (let i = 0; i < 200; i++) { if (await run(code)) return; await new Promise(resolve => setTimeout(resolve, 50)); } throw new Error('Import UI timed out: ' + await run('document.body.textContent')); };
    await until("!!document.querySelector('.overlay-context-panel')");
    await run("document.querySelector('.overlay-context').open = true; [...document.querySelectorAll('.overlay-context-panel button')].find(b => b.textContent.includes('Import resume')).click()");
    await until("document.querySelector('.overlay-context-panel [role=status]')?.textContent.includes('2 file(s)')");
    const message = await run("document.querySelector('.overlay-context-panel [role=status]').textContent");
    assert.match(message, /No readable text/); assert.match(message, /Could not read/);
    const snapshot = await require('../dist/main/services/realtimeContextService').buildRealtimeContext();
    assert.deepEqual(snapshot.sourceNames, ['candidate_resume.docx.txt', 'project_resume.pdf.txt']);
    assert.match(snapshot.instructions, /backend engineer at Example Labs/);
    assert.match(snapshot.instructions, /TypeScript billing APIs/);
    assert.match(snapshot.instructions, /Redis caching project/);
    assert.equal((await knowledge.listNotes()).filter(note => note.source === 'personal').length, 2);
    assert.ok((await knowledge.searchNotes('Redis caching')).some(note => /Redis caching/.test(note.content)));
    const duplicate = await knowledge.importNote(docx); assert.equal(duplicate.fileName, 'candidate_resume.docx-2.txt');
    assert.deepEqual(await fs.readFile(docx), documentBytes, 'Original document must stay unchanged');
    console.log('PASS: real DOCX paragraphs/table and PDF extraction through overlay import, picker formats, voice context, search, duplicate names, clear blank/corrupt/legacy errors, and original preservation.');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { overlay.destroyOverlayWindow(); await fs.rm(directory, {recursive: true, force: true}); app.exit(process.exitCode || 0); }
});
