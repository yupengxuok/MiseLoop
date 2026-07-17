import { useState, type ChangeEvent, type FormEvent } from "react";
import type { DemoState, IntakeId, IntakeUploadPayload } from "../lib/demoState/demoState";

type ConnectViewProps = {
  demoState: DemoState;
  onIntakeSample: (intakeId: IntakeId) => void;
  onIntakeUpload: (intakeId: IntakeId, payload: IntakeUploadPayload) => void;
};

const INTAKE_COPY: Record<
  IntakeId,
  {
    title: string;
    fileLabel: string;
    accept: string;
    textLabel: string;
    placeholder: string;
    submitLabel: string;
  }
> = {
  files: {
    title: "Upload restaurant files",
    fileLabel: "CSV, XLSX, PDF, or POS export",
    accept: ".csv,.xlsx,.xls,.pdf,.json,.txt",
    textLabel: "Optional notes",
    placeholder: "Example: weekend sales export from Toast, current inventory sheet, supplier price file...",
    submitLabel: "Parse files",
  },
  email: {
    title: "Paste vendor email",
    fileLabel: "Optional email attachment",
    accept: ".eml,.msg,.txt,.pdf,.csv,.xlsx,.xls",
    textLabel: "Email body",
    placeholder:
      "Paste the vendor email here. Example: Roma tomatoes move to $2.85/lb Friday; Vendor B can hold $2.35/lb with 2-day delivery.",
    submitLabel: "Parse email",
  },
  receipt_photo: {
    title: "Upload receipt photo",
    fileLabel: "Receipt, invoice, or photo",
    accept: "image/*,.pdf",
    textLabel: "Optional OCR correction",
    placeholder: "Example: Tomatoes 40 lb x $2.10 = $84.00; lettuce 25 ct x $1.35...",
    submitLabel: "Run OCR mock",
  },
  voice_note: {
    title: "Add voice note",
    fileLabel: "Audio file",
    accept: "audio/*,.m4a,.mp3,.wav",
    textLabel: "Transcript or live note",
    placeholder:
      "Example: Tomatoes from Vendor A got expensive. Check Vendor B this weekend. Keep purchase order as recommendation only.",
    submitLabel: "Parse transcript",
  },
};

function toFilePayload(files: FileList | null): IntakeUploadPayload["files"] {
  return Array.from(files ?? []).map((file) => ({
    name: file.name,
    type: file.type || file.name.split(".").pop()?.toUpperCase() || "unknown",
    sizeLabel: formatFileSize(file.size),
  }));
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function ConnectView({ demoState, onIntakeSample, onIntakeUpload }: ConnectViewProps) {
  const contextBuilt = demoState.phase !== "EMPTY";
  const hasSources = demoState.sourceCards.length > 0;
  const [activeUpload, setActiveUpload] = useState<IntakeId | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<IntakeUploadPayload["files"]>([]);
  const [inputText, setInputText] = useState("");
  const uploadCopy = activeUpload ? INTAKE_COPY[activeUpload] : null;

  function openUpload(intakeId: IntakeId) {
    setActiveUpload(intakeId);
    setSelectedFiles([]);
    setInputText("");
  }

  function closeUpload() {
    setActiveUpload(null);
    setSelectedFiles([]);
    setInputText("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(toFilePayload(event.target.files));
  }

  function handleUploadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeUpload) {
      return;
    }

    onIntakeUpload(activeUpload, {
      channel: activeUpload === "voice_note" ? "transcript" : activeUpload === "email" ? "paste" : "upload",
      files: selectedFiles,
      text: inputText.trim(),
    });
    closeUpload();
  }

  return (
    <div className="stage-panel active">
      <div className="intake-tray">
        {demoState.intakeItems.map((item) => (
          <article className="intake-chip" key={item.id}>
            <span className={item.status === "READY" ? "status approval" : "status mapped"}>
              {item.status}
            </span>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
            <button
              className="sample-button"
              disabled={contextBuilt}
              onClick={() => openUpload(item.id)}
              type="button"
            >
              Add input
            </button>
          </article>
        ))}
      </div>

      <div className="sample-fallback-row">
        <span>Need a fast dry run?</span>
        {demoState.intakeItems.map((item) => (
          <button
            className="inline-sample-button"
            disabled={contextBuilt}
            key={item.id}
            onClick={() => onIntakeSample(item.id)}
            type="button"
          >
            {item.sampleAction}
          </button>
        ))}
      </div>

      {demoState.rawInputs.length > 0 ? (
        <section className="raw-input-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Raw restaurant inputs</p>
              <h3>What the owner actually provided</h3>
            </div>
            <span className="status approval">messy input</span>
          </div>
          <div className="raw-input-grid">
            {demoState.rawInputs.map((input) => (
              <article className="raw-input-card" key={input.intakeId}>
                <div className="raw-input-heading">
                  <strong>{input.title}</strong>
                  <span className={input.status === "MAPPED" ? "status mapped" : "status approval"}>
                    {input.kind}
                  </span>
                </div>
                <ul>
                  {input.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="raw-input-panel empty">
          <div>
            <p className="eyebrow">Raw restaurant inputs</p>
            <h3>Add a file, email, receipt, or voice note to reveal the messy input.</h3>
          </div>
        </section>
      )}

      {hasSources ? (
        <div className="source-grid">
          {demoState.sourceCards.map((source) => (
            <article className="source-card" key={source.id}>
              <div className="source-top">
                <span className={`source-icon ${source.tone}`}>{source.icon}</span>
                <span className={source.status === "MAPPED" ? "status mapped" : "status approval"}>
                  {contextBuilt ? "Nexla ready" : source.status}
                </span>
              </div>
              <h3>{source.title}</h3>
              <p>{source.copy}</p>
              <div className="source-meta">
                <span>{source.rawInputType}</span>
                <span>{source.normalizedField}</span>
              </div>
              <div className="metric-row">
                <strong>{source.mappedFields} fields</strong>
                <span>{source.freshness}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-source-state">
          <span className="status approval">Waiting for inputs</span>
          <h3>No source cards yet</h3>
          <p>
            Add a real demo input above to show how raw files, email, receipt photos, and voice
            notes become Nexla-ready Restaurant Context inputs.
          </p>
        </div>
      )}

      {demoState.restaurantContextPreview.length > 0 && (
        <section className="context-preview-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Nexla Restaurant Context</p>
              <h3>Unified agent-ready fields</h3>
            </div>
            <span className={contextBuilt ? "status ready" : "status approval"}>
              {contextBuilt ? "built" : "preview"}
            </span>
          </div>
          <div className="context-preview-grid">
            {demoState.restaurantContextPreview.map((section) => (
              <article className="context-preview-card" key={section.namespace}>
                <span className="summary-label">{section.namespace}</span>
                <h3>{section.description}</h3>
                <div className="context-record-list">
                  {section.records.map((record) => (
                    <div className="context-record" key={`${section.namespace}-${record.key}`}>
                      <strong>{record.key}</strong>
                      <span>{record.value}</span>
                      <small>{record.source}</small>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="context-summary">
        <div>
          <span className="summary-label">Context version</span>
          <strong>{contextBuilt ? demoState.contextVersion : "not built"}</strong>
        </div>
        <div>
          <span className="summary-label">Source cards</span>
          <strong>{demoState.sourceCards.length}</strong>
        </div>
        <div>
          <span className="summary-label">Build endpoint</span>
          <strong>/api/context/build</strong>
        </div>
      </div>

      {activeUpload && uploadCopy && (
        <div className="upload-backdrop" role="presentation">
          <form className="upload-dialog" onSubmit={handleUploadSubmit}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">Real demo input</p>
                <h3>{uploadCopy.title}</h3>
              </div>
              <button className="icon-button" onClick={closeUpload} type="button" aria-label="Close upload">
                x
              </button>
            </div>

            <label className="upload-dropzone">
              <span>{uploadCopy.fileLabel}</span>
              <strong>{selectedFiles.length > 0 ? `${selectedFiles.length} file selected` : "Choose file"}</strong>
              <input
                accept={uploadCopy.accept}
                multiple={activeUpload === "files" || activeUpload === "email"}
                onChange={handleFileChange}
                type="file"
              />
            </label>

            {selectedFiles.length > 0 && (
              <div className="selected-file-list">
                {selectedFiles.map((file) => (
                  <div className="selected-file" key={`${file.name}-${file.sizeLabel}`}>
                    <strong>{file.name}</strong>
                    <span>
                      {file.type} · {file.sizeLabel}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <label className="upload-textarea-label" htmlFor="intake-upload-text">
              {uploadCopy.textLabel}
            </label>
            <textarea
              className="upload-textarea"
              id="intake-upload-text"
              onChange={(event) => setInputText(event.target.value)}
              placeholder={uploadCopy.placeholder}
              value={inputText}
            />

            <div className="upload-dialog-actions">
              <button className="ghost-button" onClick={closeUpload} type="button">
                Cancel
              </button>
              <button
                className="primary-button"
                disabled={selectedFiles.length === 0 && inputText.trim().length === 0}
                type="submit"
              >
                {uploadCopy.submitLabel}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
