import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate for navigation
import styles from "../styles/CourseTracking.module.css";

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

interface NoteHistory {
    id: number;
    notes: string;
    progressPercentage: number;
    updatedAt: string;
}

interface CourseInfo {
    id: number;
    name: string;
    description: string;
    videoId: string;
    pdfFilename: string;
}

const CourseTracking: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate(); // Initialize navigation

    const [progress, setProgress] = useState<number>(0);
    const [notes, setNotes] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [noteHistory, setNoteHistory] = useState<NoteHistory[]>([]);
    const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);

    const playerRef = useRef<YT.Player | null>(null);
    const videoDurationRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchCourseInfo = async () => {
            if (!courseId) return;
            try {
                const res = await fetch(`http://localhost:8080/api/courseTracking/courseInfo?courseId=${courseId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch course info");
                const data: CourseInfo = await res.json();
                setCourseInfo(data);
            } catch (error) {
                console.error("Error fetching course info:", error);
            }
        };
        fetchCourseInfo();
    }, [courseId]);

    useEffect(() => {
        if (!courseInfo?.videoId) return;

        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            tag.async = true;
            document.body.appendChild(tag);
        } else {
            loadYouTubePlayer();
        }

        window.onYouTubeIframeAPIReady = () => {
            loadYouTubePlayer();
        };

        function loadYouTubePlayer() {
            if (!courseInfo?.videoId) return;
            playerRef.current = new window.YT.Player("youtube-player", {
                height: "400",
                width: "854",
                videoId: courseInfo.videoId,
                events: {
                    onReady: (event: YT.PlayerEvent) => {
                        videoDurationRef.current = event.target.getDuration();
                    },
                    onStateChange: (event: YT.OnStateChangeEvent) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            intervalRef.current = setInterval(() => {
                                const currentTime = playerRef.current?.getCurrentTime() || 0;
                                const progressPercentage = (currentTime / videoDurationRef.current) * 100;
                                setProgress(progressPercentage);
                            }, 1000);
                        } else if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                    },
                },
            });
        }

        return () => {
            playerRef.current?.destroy();
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [courseInfo]);

    const handleSaveNotes = () => {
        if (!courseId) return;

        fetch("http://localhost:8080/api/courseTracking/save", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                courseId: Number(courseId),
                notes,
                progress,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to save notes");
                return res.json();
            })
            .then(() => {
                setMessage("Notes saved successfully!");
                setTimeout(() => setMessage(null), 3000);
            })
            .catch(() => {
                setMessage("Error saving notes.");
                setTimeout(() => setMessage(null), 3000);
            });
    };

    const handleViewHistory = () => {
        if (!courseId) return;
        fetch(`http://localhost:8080/api/courseTracking/history?courseId=${courseId}`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch history");
                return res.json();
            })
            .then((data) => setNoteHistory(data))
            .catch((err) => console.error("Error fetching history:", err));
        setShowHistory((prev) => !prev);
    };

    const handleTakeQuiz = () => {
        if (courseId) {
            navigate(`/quiz/${courseId}`);
        } else {
            console.error("Course ID is missing");
        }
    };


    return (
        <div className={styles.course}>
            <h1 className={styles.header}>Tracking Progress</h1>

            <div className={styles.courseContainer}>
                <div id="youtube-player" className={styles.videoPlayer}></div>

                <div className={styles.noteSection}>
                    <h2>Take Notes:</h2>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write your notes here..."
                        rows={10}
                    ></textarea>
                    <button onClick={handleSaveNotes}>Save Notes</button>
                    <button className={styles.viewHistoryBtn} onClick={handleViewHistory}>
                        {showHistory ? "Hide History" : "View History"}
                    </button>
                    {message && <div className={styles.feedbackMessage}>{message}</div>}
                </div>
            </div>

            {showHistory && (
                <div className={styles.historyBox}>
                    <h3>Notes History</h3>
                    <ul>
                        {noteHistory.map((entry) => (
                            <li key={entry.id} className={styles.historyItem}>
                                <p>
                                    <strong>Progress:</strong>{" "}
                                    {entry.progressPercentage
                                        ? `${Math.round(entry.progressPercentage)}%`
                                        : "0%"}
                                </p>
                                <p>
                                    <strong>Notes:</strong> {entry.notes}
                                </p>
                                <p>
                                    <em>
                                        Updated at:{" "}
                                        {entry.updatedAt
                                            ? new Date(entry.updatedAt).toLocaleString()
                                            : "N/A"}
                                    </em>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${progress}%` }}></div>
            </div>
            <div>{Math.round(progress)}% watched</div>
            <div className={styles.motivationBox}>
                <h2>“Keep pushing forward, one video at a time!”</h2>
                <p>
                    Consistency is the key to success. Keep learning and tracking your progress—you’re doing great!
                </p>
            </div>

            <footer className={styles.footer}>
                <p>SkillUp © 2024. All rights reserved.</p>
            </footer>
            {courseInfo?.pdfFilename && (
                <button
                    onClick={async () => {
                        try {
                            const res = await fetch(`http://localhost:8080/api/courseTracking/pdf/${courseInfo.id}`, {
                                method: "GET",
                                credentials: "include",
                            });
                            if (!res.ok) throw new Error("Failed to fetch PDF");

                            const blob = await res.blob();
                            const blobUrl = URL.createObjectURL(blob);
                            console.log(blobUrl)
                            navigate(`/reader/${courseInfo.id}`, {
                                state: {
                                    pdfBlobUrl: blobUrl,
                                    courseName: courseInfo.name
                                }
                            });
                        } catch (err) {
                            console.error("PDF fetch error:", err);
                        }
                    }}
                    style={{
                        position: "fixed",
                        bottom: "70px",
                        left: "20px",
                        backgroundColor: "#ff9800",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)"
                    }}
                >
                    View PDF & Translate
                </button>
            )}


            <button
                className={styles.takeQuizBtn}
                onClick={handleTakeQuiz}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "20px",
                    backgroundColor: "#118907",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Take Quiz
            </button>
        </div>
    );
};

export default CourseTracking;
