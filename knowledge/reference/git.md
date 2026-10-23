# Git interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Git Fundamentals

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/git-fundamentals

## Git; Version Control Tool; Source Control; Track Code Changes

- Git is a tool that tracks code changes over time.

- It helps developers save versions of code using commits.

- We can go back to an older working version if something breaks.

- Git works locally on our computer, even without internet.

- Real example: if a new feature breaks production code, we can rollback to the last stable commit.

```
git init
git add .
git commit -m "initial commit"
```

## Version Control System; VCS; Source Control; Code History

- A version control system helps track who changed what and when.

- It allows multiple developers to work on the same project safely.

- It helps find when a bug was introduced.

- It keeps project history organized.

- Real example: teams use Git to review and manage code changes before deployment.

```
git log --oneline
git show <commit-id>
```

## Repository; Git Repo; Local Repository; Remote Repository

- A repository is a project folder tracked by Git.

- A local repo exists on our own computer.

- A remote repo is stored online, like GitHub or GitLab.

- We push local changes to remote and pull team changes from remote.

- Git stores project history inside the hidden .git folder.

```
git remote -v
git remote add origin https://github.com/user/repo.git
```

## Git vs GitHub; GitHub vs GitLab; Git Tool vs Hosting Platform

- Git | GitHub

- Version control tool | Online hosting platform
- Works on local machine | Stores code online
- Tracks commits and branches | Helps collaboration and pull requests
- Can work without internet | Needs internet for remote access

- Git tracks code changes.

- GitHub hosts Git repositories online.

- GitLab and Bitbucket are similar to GitHub.

- We can use Git without GitHub, but GitHub makes team collaboration easier.

## Benefits Of Git; Why Use Git; Git Advantages; Team Collaboration

- Git helps us safely track and manage code changes.

- It allows developers to work on different features using branches.

- It makes rollback easy when something goes wrong.

- It supports code review through pull requests.

- Real example: one developer works on login while another works on payment without blocking each other.

```
git checkout -b feature/login
git commit -m "add login form"
```

## Staging Area; Git Index; git add; Prepare Commit

- The staging area is where we prepare changes before committing.

- git add moves selected changes into the staging area.

- It helps us commit only related changes together.

- This keeps commit history clean and meaningful.

- Real example: stage only login changes and leave unrelated UI changes for later.

```
git add login.js
git commit -m "add login validation"
```

## HEAD; Git HEAD Pointer; Current Commit; Detached HEAD

- HEAD points to the current branch or commit we are working on.

- Usually, HEAD points to the latest commit of the current branch.

- A detached HEAD means we are viewing a commit directly, not a branch.

- If we make changes in detached HEAD, we should create a branch to save them.

- Real example: use detached HEAD to check old code safely.

```
git checkout <commit-id>
git checkout -b fix-from-old-commit
```

## Commit; Git Commit; Code Snapshot; Save Changes

- A commit is a saved snapshot of project changes.

- Each commit has a unique id and message.

- Good commit messages explain what changed.

- Commits help us track, review, and rollback code.

- Real example: commit after finishing one clear task like login validation.

```
git add .
git commit -m "add login validation"
```

## Git Three Areas; Working Directory; Staging Area; Repository

- Area | Meaning

- Working Directory | Files we are currently editing
- Staging Area | Changes ready for commit
- Repository | Saved commits in Git history

- Git mainly works with three areas.

- We edit files in the working directory.

- We stage selected files before committing.

- We commit staged changes into the repository.

- This flow helps keep changes organized.

```
git status
git add .
git commit -m "save changes"
```

## Branching; Git Branch; Feature Branch; Parallel Development

- A branch is a separate line of development.

- Branches help developers work on features without affecting main code.

- We usually create separate branches for features, fixes, or experiments.

- After work is complete, the branch is merged into the main branch.

- Real example: create feature/cart for shopping cart work.

```
git checkout -b feature/cart
git checkout main
git merge feature/cart
```

## Repository vs Working Directory; Git Repo vs Working Tree; .git Folder

- Repository | Working Directory

- Stores Git history | Contains actual project files
- Lives inside .git folder | Visible files we edit daily
- Managed by Git | Managed by developer while coding

- The working directory is where we edit project files.

- The repository stores commits, branches, and history.

- The .git folder makes a normal folder a Git repository.

- If .git is deleted, Git history is lost from that local folder.

- Real example: src , package.json , and README.md are working files; .git stores history.

```
ls -a
git status
```

Up next

Git Commands and Workflow

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Git Commands and Workflow

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/git-commands-and-workflow

## git init; git init command; create git repository; new git repo; local repository

- git init creates a new Git repository inside the current folder.

- It adds a hidden .git folder where Git stores commits, branches, and history.

- Use it when you are starting a project from your own local folder.

- After git init , you can start using git add and git commit .

- Real example: use it when creating a fresh portfolio or practice project.

```
# Create a new project folder and move inside it
mkdir my-project
cd my-project

# Start Git tracking in this folder
git init

# Stage all files for the first commit
git add .

# Save the first version of the project
git commit -m "initial commit"
```

## git init vs git clone; init vs clone; create repo vs copy repo; git repository setup

- git init | git clone

- Starts a new local repo | Copies an existing repo
- No remote is added automatically | Remote is added as origin
- Used for new local projects | Used for existing GitHub projects

- Use git init when the project is new and only exists on your computer.

- Use git clone when the project already exists on GitHub, GitLab, or another remote.

- git clone downloads files, branches, and commit history.

- After git init , you usually add the remote manually.

- After git clone , the remote connection is already ready.

```
# Start Git in a new local project
git init

# Copy an existing project from GitHub
git clone https://github.com/org/repo.git
```

## git clone; clone repository; download git project; copy remote repo; clone from GitHub

- git clone copies an existing repository to your computer.

- It downloads the project files and full commit history.

- It also connects your local repo to the remote as origin .

- Use it when joining an existing team project.

- Real example: clone a company project from GitHub and start working locally.

```
# Clone the project into a folder with the same repo name
git clone https://github.com/org/project.git

# Clone using SSH, useful when SSH keys are configured
git clone git@github.com:org/project.git

# Clone into a custom folder name
git clone https://github.com/org/project.git my-folder
```

## git add; stage files; staging area; git add command; prepare commit

- git add moves changed files into the staging area.

- Staging means selecting which changes should go into the next commit.

- Nothing is committed until it is staged first.

- Use specific file names when you want clean and focused commits.

- Real example: stage only login changes instead of all project changes.

```
# Stage one specific file
git add src/auth.js

# Stage multiple files
git add src/auth.js src/user.js

# Stage all changes inside a folder
git add src/

# Stage all changed files in the current folder
git add .
```

## git commit; save changes; commit snapshot; git commit command; local history

- git commit saves staged changes as a new version in Git history.

- A commit is like a checkpoint for your project.

- Write clear commit messages so teammates understand what changed.

- Normal workflow is edit files, stage with git add , then save with git commit .

- Real example: commit after completing email validation or fixing a bug.

```
# Good commit message: explains what changed
git commit -m "feat: add email validation"

# Good commit message: explains the fix
git commit -m "fix: prevent duplicate order submission"

# Avoid unclear messages like "update" or "changes"
```

## git status; check git status; working tree; staged changes; untracked files

- git status shows the current state of your repository.

- It tells which files are staged, unstaged, or untracked.

- It does not change anything in your project.

- Use it before committing to avoid missing files.

- Real example: check whether your new component file is staged or not.

```
# Check current Git state
git status

# Example output:
# Changes to be committed: staged files
# Changes not staged: edited but not staged files
# Untracked files: new files Git is not tracking yet
```

## git log; commit history; git log command; view commits; git history

- git log shows the commit history of the current branch.

- It shows who changed what and when.

- git log --oneline gives a short and easy-to-read history.

- Use it to find older commits or understand project progress.

- Real example: check when a bug fix was added.

```
# Show full commit history
git log

# Show compact one-line history
git log --oneline

# Show last 10 commits only
git log --oneline -10

# Show branch and merge history visually
git log --oneline --graph
```

## git diff; view changes; compare changes; unstaged changes; git diff command

- git diff shows the exact line-by-line code changes.

- By default, it shows changes that are not staged yet.

- git diff --cached shows what is already staged for commit.

- Use it before committing to review your changes.

- Real example: check whether you accidentally changed unrelated files.

```
# See unstaged changes
git diff

# See staged changes before commit
git diff --cached

# Compare two branches
git diff main..feature-login

# Compare with the previous commit
git diff HEAD~1
```

## git push; push to remote; upload commits; git push origin; send code to GitHub

- git push uploads your local commits to the remote repository.

- It makes your code visible to teammates.

- Use it after committing your local changes.

- -u sets the remote branch for future simple pushes.

- Real example: push your feature branch before opening a pull request.

```
# Push local main branch to remote main
git push origin main

# Push a feature branch
git push origin feature-login

# Push and remember this remote branch for future pushes
git push -u origin feature-login
```

## git pull; get latest code; pull from remote; update local branch; git pull command

- git pull gets the latest remote changes and adds them to your current branch.

- It is basically git fetch plus git merge .

- Use it before starting new work to avoid working on old code.

- It may create conflicts if your local changes touch the same lines.

- Real example: pull latest main before creating a new feature branch.

```
# Download and merge latest main into current branch
git pull origin main

# Pull using rebase for cleaner history
git pull --rebase origin main
```

## git fetch vs git pull; fetch vs pull; download vs merge; safe update workflow

- git fetch | git pull

- Downloads remote changes only | Downloads and merges changes
- Does not change your current files | Updates your current branch
- Safer when you want to review first | Faster when you are ready to update

- git fetch lets you see remote changes before applying them.

- git pull is faster because it downloads and merges in one step.

- Use fetch when you want more control.

- Use pull when you trust the remote changes and want to update quickly.

- Real example: fetch first before merging a large team update.

```
# Download remote changes without merging
git fetch origin

# Check the latest remote main commits
git log origin/main --oneline

# See difference between your branch and remote main
git diff origin/main

# Merge remote main when ready
git merge origin/main

# Shortcut: fetch and merge together
git pull origin main
```

## git checkout vs git switch vs git restore; checkout command; switch branch; restore files

- Command | Main Use

- git checkout | Older command for branch switch and file restore
- git switch | Modern command to switch branches
- git restore | Modern command to restore or unstage files

- git checkout is older and can do many things, so it can feel confusing.

- git switch is clearer for changing branches.

- git restore is clearer for undoing file changes.

- You will still see checkout in older tutorials and projects.

- Real example: use switch for branches and restore for files.

```
# Switch to an existing branch
git switch feature-login

# Create and switch to a new branch
git switch -c new-feature

# Discard local changes in one file
git restore src/auth.js

# Unstage a file but keep the code changes
git restore --staged src/auth.js
```

## Pull Request Workflow; PR workflow; code review process; GitHub pull request; merge request

- A pull request is a request to merge your branch into another branch.

- It helps teammates review your code before it reaches main .

- PRs are handled by tools like GitHub, GitLab, or Bitbucket.

- Avoid pushing directly to main in team projects.

- Real example: create a feature branch, push it, then open a PR for review.

```
# Create a new branch for your work
git switch -c feature-login

# Stage and commit your changes
git add .
git commit -m "feat: add login page"

# Push the branch to GitHub
git push -u origin feature-login

# Then open a Pull Request on GitHub
```

## git rm; remove tracked file; untrack file; git rm cached; remove file from git

- git rm removes a tracked file and stages that deletion.

- git rm --cached stops Git from tracking a file but keeps it on your computer.

- Use --cached when a file should be ignored but was committed by mistake.

- Common example: remove .env from Git tracking and add it to .gitignore .

- After removing, commit the change so Git remembers it.

```
# Delete file from disk and stage the deletion
git rm secrets.txt

# Stop tracking .env but keep it locally
git rm --cached .env

# Add .env to gitignore so Git ignores it next time
echo ".env" >> .gitignore

# Save the change in Git history
git commit -m "remove env file from tracking"
```

## Check Git Is Installed; git version; verify git installation; git setup; git command check

- git --version checks whether Git is installed.

- It also shows the installed Git version.

- If the command is not found, Git is not installed or not added to PATH.

- Run this before starting Git practice or project setup.

- Real example: check Git installation before cloning a GitHub project.

```
# Check installed Git version
git --version

# Example success output:
# git version 2.45.0

# If Git is missing, you may see:
# command not found
```

Previous

Git Fundamentals

Up next

Git Branching and Merging

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Git Branching and Merging

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/git-branching-and-merging

## Git Branch; Branch in Git; Git Branch Definition; Feature Branch

- A branch is a separate line of work in Git.

- It helps developers work on new changes without touching main .

- Creating a branch does not copy the full project.

- Git only creates a small pointer to a commit.

- Real example: create a feature-login branch to build login safely.

```
git branch feature-login
git switch feature-login
```

## Benefits of Branching; Feature Branch Workflow; Why Use Git Branches

- Branching helps each developer work separately.

- It keeps the main branch clean and stable.

- It avoids mixing unfinished code with production-ready code.

- It makes code review easier through pull requests.

- Real example: one developer works on feature-payment , another works on bugfix-auth .

```
git switch -c feature-payment
git switch -c bugfix-auth
```

## Create Branch; Git Switch -c; Git Branch Create; New Branch

- git switch -c creates a new branch and moves into it.

- The new branch starts from your current commit.

- New commits move only that branch forward.

- Use clear branch names based on the work.

- Example names: feature-login , bugfix-cart , hotfix-payment .

```
git switch -c feature-login
git switch -c bugfix/cart-crash
```

## Switch Branch; Git Switch; Git Checkout Branch; Change Branch

- git switch is used to move from one branch to another.

- Git may block switching if your uncommitted changes conflict.

- Commit, stash, or discard changes before switching.

- git checkout also works, but it is the older command.

- Always run git status before changing branches.

```
git status
git switch main
git switch feature-login
```

## List Branches; Git Branch List; Local Branches; Remote Branches

- git branch shows all local branches.

- The current branch is marked with * .

- git branch -r shows remote branches.

- git branch -a shows both local and remote branches.

- It helps you check branches before merging or deleting.

```
git branch
git branch -r
git branch -a
```

## Delete Branch; Git Branch Delete; Delete Local Branch; Delete Remote Branch

- Delete a branch after its work is merged.

- git branch -d safely deletes a local branch.

- Git stops deletion if the branch is not merged.

- git branch -D force deletes the branch.

- Use force delete only when you are sure.

```
git branch -d feature-login
git branch -D feature-login
git push origin --delete feature-login
```

## Rename Branch; Git Branch -m; Git Rename Branch; Change Branch Name

- git branch -m is used to rename a branch.

- Local rename does not rename the remote branch.

- Push the new branch name to remote after renaming.

- Delete the old remote branch if it was already pushed.

- Use meaningful names so the team can understand the work.

```
git branch -m feature-login feature-auth
git push origin -u feature-auth
git push origin --delete feature-login
```

## Git Merge vs Rebase; Merge or Rebase; Git History; Linear History

- Git Merge | Git Rebase

- Combines branches using a merge commit | Moves commits on top of another branch
- Keeps full branch history | Creates cleaner linear history
- Safer for shared branches | Better for local cleanup
- History can look more detailed | History can look simpler

- Both merge and rebase combine changes from branches.

- Merge is safer when working with team branches.

- Rebase is useful before pushing your own local branch.

- Do not rebase public shared branches without team agreement.

- Merge preserves history, rebase rewrites history.

```
git merge feature-login
git rebase main
```

## Cherry Pick; Git Cherry-Pick; Apply One Commit; Pick Commit

- git cherry-pick applies one specific commit from another branch.

- It is useful when you need only one fix, not the full branch.

- Git creates a new commit with the same changes.

- Use it carefully because duplicate commits can confuse history.

- Real example: move one bug fix from a feature branch to main .

```
git log --oneline
git switch main
git cherry-pick a3f2c1
```

## Merge Conflict; Git Conflict; Conflict in Git; Same Line Change

- A merge conflict happens when Git cannot decide which change to keep.

- It usually happens when two branches edit the same lines.

- It is not a Git failure; it needs a human decision.

- Git shows both versions using conflict markers.

- You must edit the file and keep the correct final code.

```
<<<<<<< HEAD
const timeout = 5000;
=======
const timeout = 3000;
>>>>>>> feature-login
```

## Resolve Merge Conflict; Fix Git Conflict; Conflict Resolution Steps

- Open the conflicted file and find the conflict markers.

- Choose the correct code or combine both changes.

- Remove >>>>>> lines.

- Run tests to make sure the code still works.

- Use git add and continue the merge.

```
git status
git add src/auth.js
git merge --continue
```

## Detached HEAD; Git Detached Head; Checkout Commit; Recover Work

- Detached HEAD means Git is pointing to a commit, not a branch.

- It usually happens when you checkout a commit directly.

- You can inspect old code in this state.

- New commits may be lost if you do not create a branch.

- Create a branch to safely keep work from detached HEAD.

```
git checkout abc1234
git switch -c experiment
```

## Types of Branches; Feature Branch; Release Branch; Hotfix Branch

- Feature branches are used for new features.

- Bugfix branches are used for normal bug fixes.

- Hotfix branches are used for urgent production fixes.

- Release branches are used before deployment.

- Clear branch types help the team understand the purpose.

```
git switch -c feature/user-profile
git switch -c hotfix/payment-crash
git switch -c release/v2.1.0
```

## Fetch Remote Branches; Git Fetch; Git Fetch --all; Remote Tracking Branch

- git fetch downloads latest remote changes.

- It does not change your local files.

- It updates remote tracking branches like origin/main .

- Use fetch before comparing or merging remote work.

- git fetch --all fetches updates from all remotes.

```
git fetch origin
git fetch --all
git branch -r
```

Previous

Git Commands and Workflow

Up next

Git Remotes and Collaboration

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Git Remotes and Collaboration

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/git-remotes-and-collaboration

## Git Remote; Remote Repository; Remote URL; GitHub Remote; Origin Upstream

- A remote is a saved URL that connects your local repo to an online repo.

- It helps you share code with teammates and keep a backup on GitHub or GitLab.

- The default remote name is usually origin .

- You can add another remote like upstream when working with forks.

- Real example: your laptop repo pushes code to the company GitHub repo.

```
# Show all remote names and URLs
git remote -v

# Add another remote repo URL
git remote add upstream https://github.com/original/repo.git
```

## Origin In Git; Git Origin; Origin Remote; Default Remote; GitHub Origin

- origin is the default name Git gives to the remote repo after cloning.

- It usually points to your main GitHub or GitLab repository.

- origin is only a name, so we can rename it or change its URL.

- We use origin when pushing or pulling code from the main remote repo.

- Real example: git push origin main sends your local commits to GitHub.

```
# Check where origin is pointing
git remote -v

# Change the origin URL
git remote set-url origin git@github.com:yourname/repo.git

# Push local main branch to origin
git push origin main
```

## Manage Git Remotes; Git Remote Add; Git Remote Remove; Git Remote Set URL; Remote Commands

- Remote commands help us add, update, view, or remove repo URLs.

- git remote -v shows all connected remote repositories.

- git remote add connects a new remote repository.

- git remote remove deletes an old remote connection.

- git remote set-url changes the URL of an existing remote.

```
# List all remotes
git remote -v

# Add a new remote named origin
git remote add origin git@github.com:org/repo.git

# Remove an old remote
git remote remove old-remote

# Update an existing remote URL
git remote set-url origin git@github.com:org/new-repo.git
```

## Git Remote vs Git Clone; Clone vs Remote; Repository URL; Git Setup Difference

- Git Clone | Git Remote

- Copies a repo to your machine | Manages repo URLs
- Usually done once at the start | Used after setup also
- Creates origin automatically | Adds or changes remote links

- git clone downloads the project for the first time.

- git remote manages the online repo connection after that.

- Real example: clone once, then use remote commands when the repo URL changes.

```
# Download the repo for the first time
git clone git@github.com:org/repo.git

# Add another remote later without cloning again
git remote add upstream https://github.com/original/repo.git
```

## Git Push; Push Commits; Push Branch To Remote; Upload Code; GitHub Push

- git push sends your local commits to the remote repository.

- It helps teammates see your latest code.

- Use -u the first time to connect your local branch with the remote branch.

- After upstream is set, plain git push is usually enough.

- If remote has newer code, pull or fetch first before pushing.

```
# First push of a new branch and set upstream tracking
git push -u origin feature-login

# Push next commits on the same branch
git push

# Push main branch to origin clearly
git push origin main
```

## Git Pull; Pull Latest Code; Fetch And Merge; Update Local Branch; Git Pull Command

- git pull brings the latest remote changes into your current branch.

- It is basically git fetch plus git merge in one command.

- Use it before starting work to stay updated with teammates.

- git pull --rebase keeps history cleaner in many teams.

- Real example: pull latest main before creating a new feature branch.

```
# Pull latest changes from the tracked branch
git pull

# Pull latest code from origin main
git pull origin main

# Pull using rebase for cleaner history
git pull --rebase
```

## Git Fetch vs Git Pull; Fetch vs Pull; Download vs Merge; Safe Sync; Git Update Difference

- Git Fetch | Git Pull

- Downloads changes only | Downloads and merges changes
- Does not change your files | Can update your current branch
- Safer for review first | Faster when you trust the changes

- Use git fetch when you want to check remote changes before merging.

- Use git pull when you want to directly update your current branch.

- Real example: fetch first before merging important production changes.

```
# Download remote changes without touching current files
git fetch origin

# See what changed in remote main
git diff origin/main

# Merge remote main when ready
git merge origin/main

# Shortcut: fetch and merge together
git pull origin main
```

## Delete Remote Branch; Remove GitHub Branch; Git Push Delete; Cleanup Branch; Prune Remote

- We delete remote branches after the pull request is merged.

- It keeps the remote repository clean and easy to search.

- Deleting a remote branch does not delete your local branch.

- Use git fetch --prune to remove stale remote references locally.

- Real example: remove feature-login after it is merged into main .

```
# Delete the branch from remote GitHub/GitLab
git push origin --delete feature-login

# Delete the same branch from your local machine
git branch -d feature-login

# Clean old remote branch references locally
git fetch --prune
```

## Fork vs Branch vs Clone; Git Fork; Git Branch; Git Clone; Open Source Workflow

- Fork | Clone | Branch

- Server-side copy of a repo | Local copy on your machine | Separate line of work
- Usually in your GitHub account | Used to work locally | Used for features or fixes
- Common in open source | Common for all projects | Common in team workflow

- A fork copies someone else's repo into your account.

- A clone downloads a repo to your computer.

- A branch lets you work on changes without touching main .

```
# Clone your fork to your laptop
git clone git@github.com:yourname/repo.git

# Add original repo as upstream
git remote add upstream https://github.com/original/repo.git

# Create a branch for your change
git switch -c fix/readme-typo

# Push your branch to your fork
git push origin fix/readme-typo
```

## Pull Request; PR; Merge Request; Code Review; GitHub PR Workflow

- A pull request asks to merge your branch into another branch like main .

- It lets teammates review your code before it goes into the main codebase.

- CI/CD checks can run automatically on the PR.

- Reviewers can suggest changes, approve, or request fixes.

- Real example: create a PR after pushing your feature-login branch.

```
# Create a new feature branch
git switch -c feature-login

# Push your branch to remote
git push origin feature-login

# Then open a PR on GitHub or GitLab
```

## Benefits Of Pull Requests; PR Benefits; Code Review; Team Collaboration; Stable Main Branch

- Pull requests help catch bugs before code is merged.

- They improve code quality through teammate review.

- They keep the main branch stable.

- They help team members understand each other's changes.

- Real example: a reviewer can catch a missing validation before release.

```
# Push feature branch first
git push origin feature-login

# Open PR so teammates can review before merge
```

## Git Hosting Services; GitHub vs GitLab vs Bitbucket; Azure Repos; Repository Hosting

- Service | Common Use

- GitHub | Popular for open source and most teams
- GitLab | Strong built-in CI/CD and self-hosting
- Bitbucket | Common with Jira and Atlassian tools
- Azure Repos | Common in Microsoft/Azure teams

- Git hosting services store Git repositories online.

- They add collaboration features like PRs, issues, permissions, and CI/CD.

- GitHub is commonly preferred for new personal and open-source projects.

- GitLab is strong when teams want built-in DevOps tools.

- The Git commands are mostly the same across all hosting services.

```
# Check which hosting service your repo points to
git remote -v

# Example output shows GitHub as the remote host
# origin  git@github.com:you/project.git (fetch)
# origin  git@github.com:you/project.git (push)
```

Previous

Git Branching and Merging

Up next

Git Undo Stash and History

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Git Undo Stash and History

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/git-undo-stash-and-history

## Undo Last Commit; Git Reset; Unpushed Commit; Remove Last Commit

- git reset is used to undo a local commit before pushing.

- --soft removes the commit but keeps changes staged.

- --mixed removes the commit and keeps changes unstaged.

- --hard removes the commit and deletes the changes.

- Use reset only when the commit is not shared with others.

```
git reset --soft HEAD~1
git reset HEAD~1
git reset --hard HEAD~1
```

## Git Reset Modes; Soft Reset; Mixed Reset; Hard Reset

- Soft Reset | Mixed Reset | Hard Reset

- Keeps changes staged | Keeps changes unstaged | Deletes changes
- Safe for recommit | Useful for editing files | Risky if changes are needed
- Command: --soft | Command: --mixed | Command: --hard

- --soft is useful when I want to change the last commit message.

- --mixed is useful when I want to edit and commit again.

- --hard is useful only when I really want to remove all local changes.

```
git reset --soft HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~1
```

## Git Reset vs Git Revert; Undo Commit; Safe Undo; Revert vs Reset

- Git Reset | Git Revert

- Moves commit history backward | Creates a new undo commit
- Best for local commits | Best for pushed commits
- Rewrites history | Keeps history safe
- Can cause issues in shared branches | Safe for team work

- git reset is good when the commit is only in my local system.

- git revert is good when the commit is already pushed.

- In team projects, revert is safer than reset .

- reset changes history, but revert adds a new commit.

## Revert Pushed Commit; Git Revert; Undo Remote Commit; Public Commit

- git revert is used to undo a commit that is already pushed.

- It creates a new commit that reverses the old commit changes.

- It is safe because it does not remove commit history.

- It is better than force push on a shared branch.

- Real example: if a pushed login bug breaks production, we can revert that commit.

```
git log --oneline
git revert abc123
git push origin main
```

## Git Commit Amend; Fix Last Commit; Change Commit Message; Add Missing File

- git commit --amend is used to update the last commit.

- We can use it to change the last commit message.

- We can also use it to add a missed file into the last commit.

- It creates a new commit hash, so use it carefully.

- It is best to use before pushing the commit.

```
git add missing-file.js
git commit --amend --no-edit
```

## Git Stash; Save Temporary Changes; Stash Work; Uncommitted Changes

- git stash temporarily saves changes without creating a commit.

- It helps when I need to switch branches quickly.

- It keeps my working area clean.

- Real example: I can stash feature work, fix an urgent bug, and come back.

- After finishing, I can restore the saved work using git stash pop .

```
git stash
git switch main
git switch feature-branch
git stash pop
```

## Git Stash Commands; Stash List; Stash Pop; Stash Apply; Stash Drop

- git stash saves current changes temporarily.

- git stash list shows all saved stashes.

- git stash pop restores the latest stash and removes it from the list.

- git stash apply restores the stash but keeps it in the list.

- git stash drop removes a selected stash.

```
git stash list
git stash pop
git stash apply
git stash drop stash@{0}
```

## Git Merge Abort; Cancel Merge; Stop Merge Conflict; Abort Merge

- git merge --abort is used to cancel a merge in progress.

- It is helpful when merge conflicts are too confusing.

- It takes the branch back to the state before the merge started.

- I should check git status before aborting.

- After aborting, I can pull latest changes and try again.

```
git status
git merge --abort
```

## Git Reflog; Recover Lost Commit; Git History; Reflog vs Log

- git reflog shows recent movements of HEAD .

- It helps recover commits lost after reset, amend, or rebase.

- git log shows normal commit history, but reflog shows more local history.

- It is useful when I accidentally run git reset --hard .

- Reflog is local to my system, so teammates cannot see it.

```
git reflog
git checkout -b recovered-branch abc123
```

Previous

Git Remotes and Collaboration

Up next

Git Configuration and Best Practices

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Git Configuration and Best Practices

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/git-configuration-and-best-practices

## Git Username and Email; Git Config User; Global Git Config; Commit Author

- Git uses username and email to show who created each commit.

- We set them once after installing Git.

- Global config works for all repositories on the same machine.

- This helps teams identify commit authors in git log .

- We can check the saved values using git config .

```
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

git config user.name
git config user.email
```

## Local Git Config; Repository Config; Work Email; Personal Email

- Local Git config is used only for one specific repository.

- It is useful when we use different emails for work and personal projects.

- Local config has higher priority than global config.

- Real example: personal projects can use Gmail, and company projects can use work email.

- Local config overrides global settings, so it is ideal for managing multiple Git identities across different projects.

```
git config user.name "Your Name"
git config user.email "you@company.com"

git config user.email
```

## Gitignore; .gitignore File; Ignore Files; Git Ignore Patterns

- .gitignore tells Git which files should not be tracked.

- We use it to avoid committing unwanted files like node_modules , logs, and build folders.

- It also helps avoid pushing secret files like .env .

- Real example: in a React app, we usually ignore node_modules and dist .

- If a file is already tracked, adding it to .gitignore will not remove it automatically.

```
node_modules/
dist/
.env
*.log
.DS_Store
```

## Commit Message Convention; Conventional Commits; Git Commit Message; Commit Format

- A good commit message clearly explains what changed.

- Conventional commits usually follow type: short message .

- It makes project history easy to read in git log .

- Real example: feat is used for a new feature, and fix is used for a bug fix.

- Clear commit messages reduce debugging time, as git log becomes a readable change history for the whole team.

```
git commit -m "feat: add login form"
git commit -m "fix: handle empty email"
git commit -m "docs: update setup steps"
```

## Git Alias; Git Shortcut; Git Config Alias; Short Git Commands

- Git alias is a shortcut for a longer Git command.

- We use aliases to type common commands faster.

- It reduces mistakes when we use commands again and again.

- Real example: git st can be used instead of git status .

- Aliases can also wrap complex commands like git log --oneline --graph into a single short keyword.

```
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.lg "log --oneline --graph"

git st
git lg
```

## Gitflow Workflow; Git Flow; Branching Strategy; Release Workflow

- Gitflow is a branching workflow used to manage features, releases, and production code.

- It usually uses main , develop , feature , release , and hotfix branches.

- main keeps production-ready code, and develop keeps ongoing development work.

- It is useful for large teams, but it can feel heavy for small projects.

- Gitflow separates development from production, making hotfixes and version releases predictable without breaking ongoing work.

```
git switch -c feature/login develop

git switch develop
git merge feature/login

git switch -c release/1.0.0 develop
```

## Git Hooks; Pre-Commit Hook; Git Automation; Husky

- Git hooks are scripts that run automatically during Git actions.

- We use them to check code before committing or pushing.

- A pre-commit hook can run linting, formatting, or tests.

- Real example: a team can block commits if npm run lint fails.

- Pre-push hooks can run tests while pre-commit hooks enforce linting, preventing broken code from ever reaching the repository.

```
# .husky/pre-commit
npm run lint
```

## Git Tag; Release Tag; Annotated Tag; Lightweight Tag

- A Git tag marks an important commit in the project history.

- Tags are commonly used for release versions like v1.0.0 .

- An annotated tag stores extra details like message, date, and author.

- A lightweight tag is just a simple pointer to a commit.

- Unlike branches, tags are immutable and always point to the same commit, making them reliable markers for deployments and rollbacks.

```
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

git tag
git show v1.0.0
```

Previous

Git Undo Stash and History

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
