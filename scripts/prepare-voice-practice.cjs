const {app}=require('electron');
app.whenReady().then(async()=>{
 try {
  const answer=await require('../dist/main/services/chatgptDesktopService').askChatGptDesktop(
   'For this mock interview practice session, follow these instructions for every subsequent spoken question. Give the substantive answer directly as written text in the conversation. Do not say Got it, Understood, I will check, Let me put that on screen, or any other acknowledgement, preamble or closing offer. Prefer two to four concise sentences unless code or a longer explanation is requested. For coding questions provide the solution and a brief explanation. For experience questions use only resume facts supplied in this conversation; label hypothetical examples and never invent personal employment experience. Prefer text-only replies with no spoken response. Display the answer as soon as it is available without a deliberate word-by-word reveal or delay. If the voice interface still generates audio, keep the written answer available. Wait for the next question. Reply to this setup message with only Ready.'
  );console.log(answer);
 }catch(e){console.error(e);process.exitCode=1;}finally{app.exit(process.exitCode||0);}
});
