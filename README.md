# Meme Error Sound

A simple VS Code extension that randomly plays one of five meme sounds (`faaah.mp3`, `brain-aneurysm.mp3`, `cat_meme.mp3`, `pipe.mp3`, or `rizz.mp3`) when a terminal command ends with a non-zero exit code.

I made this for my own setup after watching IG reels. If other people want to use it too, feel free.

## What It Does

- Watches terminal commands in VS Code.
- If a command fails, it randomly plays a meme sound from the `assets/` folder (`faaah.mp3`, `brain-aneurysm.mp3`, `cat_meme.mp3`, `pipe.mp3`, or `rizz.mp3`).
- It does not read your files, send data anywhere, scrape anything, mine crypto, or do weird background stuff.

## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Compile the extension

```bash
npm run compile
```

### 3. Run it in VS Code

1. Open this project in VS Code.
2. Press `F5`.
3. A new Extension Development Host window will open.

## Install It In Your Own VS Code

If you want to use it in your normal VS Code without pressing `F5` every time:

### 1. Build the extension

```bash
npm run compile
```

### 2. Package it as a `.vsix`

```bash
npm run package:vsix
```

This creates a file like:

```text
meme-error-sound-0.0.1.vsix
```

### 3. Install the `.vsix`

In VS Code:

1. Open the Extensions view.
2. Click the `...` menu in the top right.
3. Choose `Install from VSIX...`
4. Pick the generated `.vsix` file.

After that, the extension stays installed in your normal VS Code.

## How To Use

1. Open the terminal in the Extension Development Host window.
2. Run a command that fails, for example:

```bash
npm run this-does-not-exist
```

3. If the command exits with an error, the extension plays the sound effect.

## Sound Files

The extension randomly selects one of the following sounds:

```text
assets/faaah.mp3
assets/brain-aneurysm.mp3
assets/cat_meme.mp3
assets/pipe.mp3
assets/rizz.mp3
```

If you want different sounds later, you can replace these files in the `assets/` folder and update the `SOUND_FILE_NAMES` array in `src/extension.ts`.

## Notes

- This extension listens for terminal command completion, not raw terminal text.
- It activates automatically after VS Code startup because the extension uses `onStartupFinished`.
- It works best when VS Code shell integration is active, which is the normal default in modern VS Code.
- On Linux, the extension needs an available audio player such as `ffplay`, `mpg123`, or `mpv`.
- Tested with VS Code `1.100.3`.

## Project Safety

There is nothing suspicious in this project.

- No scraper
- No miner
- No crypto
- No hidden network behavior
- Just a small VS Code extension that plays a meme sound on terminal errors

## Publish To GitHub

If you want to upload this project after everything is okay:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

After pushing, your repo should include the source code, README, license, and asset file, while `node_modules`, `out`, and `.vsix` files stay out of git because of `.gitignore`.

## Package The Extension Later

If you want to turn it into a VS Code extension package later, you can use `vsce`:

```bash
npm install -g @vscode/vsce
vsce package
```

That will create a `.vsix` file you can install in VS Code.
