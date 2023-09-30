import { useState, useEffect } from "react";
import Markdoc from "@markdoc/markdoc";
import {
	SaveIcon,
	EraserIcon,
	GitHubIcon,
	FullScreenIcon,
	ExitFullScreenIcon,
} from "./Icons";
import "./styles/app.css";
import initialText from "./initialText";

export default function App() {
	const [editorContent, setEditorContent] = useState(initialText);
	const [previewContent, setPreviewContent] = useState("");
	const [isFullScreen, setIsFullScreen] = useState(false);

	const handleFullScreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			setIsFullScreen(true);
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
			setIsFullScreen(false);
		}
	};

	const handleClear = () => {
		setEditorContent("");
	};

	const handleSaveAs = async () => {
		const content = editorContent.replace(/\n/g, "\r\n");
		const blob = new Blob([content], { type: "text/markdown" });
		if ("showSaveFilePicker" in window) {
			try {
				const fileHandle = await window.showSaveFilePicker({
					suggestedName: "readme.md",
				});
				const writableStream = await fileHandle.createWritable();
				await writableStream.write(blob);
				await writableStream.close();
			} catch (error) {
				alert(error);
			}
		} else {
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = "readme.md";
			link.click();
		}
	};

	useEffect(() => {
		const source = editorContent.replace(/\n/g, "\r\n");
		const ast = Markdoc.parse(source);
		const content = Markdoc.transform(ast, {});
		const html = Markdoc.renderers.html(content);
		setPreviewContent(html);
	}, [editorContent]);

	return (
		<div className="container">
			<section className="header">
				<span className="file-name">readme.md</span>
				<div className="buttons">
					<button className="btn" onClick={handleFullScreen}>
						{isFullScreen ? <ExitFullScreenIcon /> : <FullScreenIcon />}
					</button>

					<button className="btn" onClick={handleClear}>
						<EraserIcon />
					</button>

					<button className="btn" onClick={handleSaveAs}>
						<SaveIcon />
					</button>

					<a
						href="https://github.com/MohammadMehdiBeheshti/mark-down-preview"
						target="_blank"
						rel="noreferrer"
					>
						<GitHubIcon />
					</a>
				</div>
			</section>
			<textarea
				className="editor"
				id="editor"
				value={editorContent}
				onInput={(e) => setEditorContent(e.target.value)}
			></textarea>
			<section
				className="preview"
				id="preview"
				dangerouslySetInnerHTML={{ __html: previewContent }}
			></section>
		</div>
	);
}
