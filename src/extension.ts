import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import * as vscode from 'vscode';

const SOUND_FILE_NAME = 'faaah.mp3';

export function activate(context: vscode.ExtensionContext) {
	const output = vscode.window.createOutputChannel('Meme Error Sound');
	const soundPath = path.join(context.extensionPath, 'assets', SOUND_FILE_NAME);

	let isPlaying = false;
	let hasShownMissingAssetWarning = false;
	let hasShownPlaybackWarning = false;

	const disposable = vscode.window.onDidEndTerminalShellExecution((event) => {
		if (event.exitCode === 0 || event.exitCode === undefined || isPlaying) {
			return;
		}

		if (!fs.existsSync(soundPath)) {
			if (!hasShownMissingAssetWarning) {
				hasShownMissingAssetWarning = true;
				vscode.window.showWarningMessage(
					`Meme Error Sound could not find assets/${SOUND_FILE_NAME}.`
				);
			}
			return;
		}

		isPlaying = true;
		void playSound(soundPath)
			.catch((error: unknown) => {
				output.appendLine(
					`Failed to play sound for "${event.execution.commandLine.value}": ${String(error)}`
				);
				if (!hasShownPlaybackWarning) {
					hasShownPlaybackWarning = true;
					vscode.window.showWarningMessage(
						'Meme Error Sound could not play the MP3 on this machine. Check the output channel for details.'
					);
				}
			})
			.finally(() => {
				isPlaying = false;
			});
	});

	context.subscriptions.push(disposable, output);
}

export function deactivate() {}

function playSound(soundPath: string): Promise<void> {
	const command = getPlayCommand(soundPath);

	if (!command) {
		return Promise.reject(new Error(`Unsupported platform: ${process.platform}`));
	}

	return new Promise((resolve, reject) => {
		exec(command, (error) => {
			if (error) {
				reject(error);
				return;
			}

			resolve();
		});
	});
}

function getPlayCommand(soundPath: string): string | undefined {
	switch (process.platform) {
		case 'darwin':
			return `afplay ${shellQuote(soundPath)}`;
		case 'linux':
			return [
				`if command -v ffplay >/dev/null 2>&1; then ffplay -nodisp -autoexit -loglevel quiet ${shellQuote(soundPath)}`,
				`elif command -v mpg123 >/dev/null 2>&1; then mpg123 -q ${shellQuote(soundPath)}`,
				`elif command -v mpv >/dev/null 2>&1; then mpv --no-terminal --really-quiet ${shellQuote(soundPath)}`,
				'else exit 127',
				'fi',
			].join('; ');
		case 'win32': {
			const soundUrl = pathToFileURL(soundPath).toString();
			return [
				'powershell -NoProfile -Command',
				`"Add-Type -AssemblyName presentationCore;`,
				`$player = New-Object System.Windows.Media.MediaPlayer;`,
				`$player.Open([Uri]'${escapePowerShellSingleQuoted(soundUrl)}');`,
				'$player.Volume = 1.0;',
				'$player.Play();',
				'Start-Sleep -Milliseconds 1800;',
				'$player.Close()"',
			].join(' ');
		}
		default:
			return undefined;
	}
}

function shellQuote(value: string): string {
	return `"${value.replace(/(["\\$`])/g, '\\$1')}"`;
}

function escapePowerShellSingleQuoted(value: string): string {
	return value.replace(/'/g, "''");
}
