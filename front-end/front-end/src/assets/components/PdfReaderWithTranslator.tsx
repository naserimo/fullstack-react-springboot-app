import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import styles from "../styles/PdfReaderWithTranslator.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfReaderState {
    pdfBlobUrl?: string;
    courseName?: string;
}

interface TranslationApiResponse {
    translatedText: string;
}

interface Language {
    code: string;
    name: string;
    targets?: string[];
}

const PdfReaderWithTranslator: React.FC = () => {
    const { state } = useLocation() as { state: PdfReaderState | null };
    const { pdfBlobUrl, courseName } = state || {};

    const [numPages, setNumPages] = useState<number | null>(null);
    const [text, setText] = useState("");
    const [translated, setTranslated] = useState<string>("");
    const [sourceLang, setSourceLang] = useState("en");
    const [targetLang, setTargetLang] = useState("it");
    const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/languages")
            .then((res) => res.json())
            .then((data: Language[]) => {
                const flatLanguages: Language[] = [];

                data.forEach((lang) => {
                    // Add source language
                    flatLanguages.push({ code: lang.code, name: lang.name });

                    // Add each target language
                    if (lang.targets) {
                        lang.targets.forEach((targetCode) => {
                            if (!flatLanguages.some((l) => l.code === targetCode)) {
                                flatLanguages.push({ code: targetCode, name: targetCode }); // Fallback name
                            }
                        });
                    }
                });

                setAvailableLanguages(flatLanguages);
            })
            .catch((err) => console.error("Failed to fetch languages", err));
    }, []);


    const handleTranslate = async () => {
        try {
            const response = await fetch("http://localhost:5000/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    q: text,
                    source: sourceLang,
                    target: targetLang,
                    format: "text",
                }),
            });
            const data = (await response.json()) as TranslationApiResponse;
            setTranslated(data.translatedText);
        } catch (err) {
            console.error("Translation failed", err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.pdfViewer}>
                <h2>{courseName ||  "Course PDF Viewer"}</h2>            //is a fallback title, shown only when courseName is undefined or null.
                <Document
                    file={pdfBlobUrl}
                    onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
                    onLoadError={(err) => console.error("PDF load error:", err)}
                >
                    {Array.from(new Array(numPages || 0), (_, index) => (
                        <Page key={index} pageNumber={index + 1}/>
                    ))}
                </Document>
            </div>

            <div className={styles.translatorBox}>

                <h3>Translator</h3>
                <div className={styles.languageSelector}>
                    <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className={styles.selectInput}
                    >
                        {availableLanguages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    <span>→</span>
                    <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className={styles.selectInput}
                    >
                        {availableLanguages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
                <textarea
                    className={styles.textInput}
                    rows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to translate"
                />
                <button
                    className={styles.translateButton}
                    onClick={handleTranslate}
                >
                    Translate
                </button>
                <h4>Translated:</h4>
                <div className={styles.translatedBox}>{translated}</div>
            </div>
            <div className={styles.system}>
                <div className={styles["system__orbit"] + " " + styles["system__orbit--sun"]}>
                    <img
                        src="https://www.dropbox.com/s/g02pto204mz1ywi/sun.png?raw=1"
                        alt="Sun"
                        className={styles["system__icon"]}
                    />
                </div>

                {["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"].map((planet) => (
                    <div
                        key={planet}
                        className={`${styles["system__orbit"]} ${styles[`system__orbit--${planet}`]}`}
                    >
                        <div className={`${styles["system__planet"]} ${styles[`system__planet--${planet}`]}`}>
                            <img
                                src={`https://www.dropbox.com/s/${planet === "earth"
                                    ? "ropzlyhb1v19l5t"
                                    : planet === "venus"
                                        ? "wvictuysutiirho"
                                        : planet === "mercury"
                                            ? "2o38602cmwhhdi1"
                                            : planet === "mars"
                                                ? "fa9biyj617n1q30"
                                                : planet === "jupiter"
                                                    ? "d28oxi2c74zcoqk"
                                                    : planet === "saturn"
                                                        ? "h8pj72v6mmaa0yq"
                                                        : planet === "uranus"
                                                            ? "du6znsmfos2r4ry"
                                                            : planet === "neptune"
                                                                ? "170sr7xl6gxpona"
                                                                : "z7axkafhs887t9b"
                                }/${planet}.png?raw=1`}
                                alt={planet}
                            />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PdfReaderWithTranslator;
