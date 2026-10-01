import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import "./ProblemDetails.css";

function ProblemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);

    const [code, setCode] = useState("");
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [output, setOutput] = useState("");
    const [verdict, setVerdict] = useState("");


    // FETCH PROBLEM
    useEffect(() => {

        const fetchProblem = async () => {

            const token =
                localStorage.getItem("accessToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await api.get(
                    `/problems/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const data =
                    response.data.problem;

                setProblem(data);

                setCode(
                    data.starterCode?.cpp || ""
                );

            } catch (error) {

                console.error(
                    "Problem error:",
                    error
                );

                if (
                    error.response?.status === 401
                ) {

                    localStorage.removeItem(
                        "accessToken"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    navigate("/login");
                }

            } finally {

                setLoading(false);

            }
        };

        fetchProblem();

    }, [id, navigate]);


    // RUN CODE
    const handleRunCode = async () => {

        const token =
            localStorage.getItem("accessToken");

        if (!token) {
            navigate("/login");
            return;
        }

        if (!code.trim()) {

            setOutput(
                "Please write some code first."
            );

            return;
        }

        setRunning(true);
        setOutput("Running code...");
        setVerdict("");

        try {

            const response = await api.post(
    "/submissions/run",
    {
        sourceCode: code,
        languageId: 54,
        stdin: problem.testCases?.[0]?.input || ""
    },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const result =
                response.data.result;


            if (result.stdout) {

                setOutput(
                    result.stdout
                );

            } else if (result.stderr) {

                setOutput(
                    result.stderr
                );

            } else if (result.compile_output) {

                setOutput(
                    result.compile_output
                );

            } else {

                setOutput(
                    result.status?.description ||
                    "Execution completed."
                );

            }

        } catch (error) {

            console.error(
                "Run code error:",
                error
            );

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate("/login");

                return;
            }

            setOutput(
                error.response?.data?.message ||
                "Code execution failed."
            );

        } finally {

            setRunning(false);

        }
    };


    // SUBMIT CODE
    const handleSubmit = async () => {

        const token =
            localStorage.getItem("accessToken");

        if (!token) {
            navigate("/login");
            return;
        }

        if (!code.trim()) {

            setVerdict(
                "Please write some code first."
            );

            return;
        }

        setSubmitting(true);

        setVerdict("");

        setOutput(
            "Submitting code..."
        );

        try {

            const response = await api.post(
                "/submissions/submit",
                {
                    problemId: id,
                    sourceCode: code,
                    languageId: 54,
                    language: "cpp",
                    stdin: ""
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const submission =
                response.data.submission;


            setVerdict(
                submission.status ||
                "Unknown"
            );


            setOutput(
                submission.stdout ||
                submission.stderr ||
                submission.compileOutput ||
                "No output"
            );

        } catch (error) {

            console.error(
                "Submission error:",
                error
            );

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate("/login");

                return;
            }

            setVerdict(
                error.response?.data?.message ||
                "Submission failed."
            );

        } finally {

            setSubmitting(false);

        }
    };


    // LOADING
    if (loading) {

        return (
            <div className="problem-details-loading">

                Loading problem...

            </div>
        );

    }


    // PROBLEM NOT FOUND
    if (!problem) {

        return (
            <div className="problem-details-loading">

                <h2>
                    Problem not found
                </h2>

                <button
                    onClick={() =>
                        navigate("/problems")
                    }
                >
                    ← Back to Problems
                </button>

            </div>
        );

    }


    return (
        <div className="problem-details-page">


            {/* NAVBAR */}

            <nav className="problem-details-nav">

                <div
                    className="problem-details-logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >

                    <div className="problem-details-logo-icon">
                        R
                    </div>

                    <span>
                        RankUp
                    </span>

                </div>


                <button
                    className="problem-back-btn"
                    onClick={() =>
                        navigate("/problems")
                    }
                >
                    ← Problems
                </button>

            </nav>



            {/* WORKSPACE */}

            <main className="problem-workspace">


                {/* LEFT SIDE */}

                <section className="problem-panel">


                    <div className="problem-title-section">

                        <div className="problem-details-label">
                            PROBLEM
                        </div>


                        <div className="problem-title-row">

                            <h1>
                                {problem.title}
                            </h1>


                            <span
                                className={
                                    `problem-difficulty ` +
                                    problem.difficulty.toLowerCase()
                                }
                            >
                                {problem.difficulty}
                            </span>

                        </div>


                        <div className="problem-detail-tags">

                            {problem.tags?.map(
                                (tag) => (

                                    <span key={tag}>
                                        {tag}
                                    </span>

                                )
                            )}

                        </div>

                    </div>



                    <div className="problem-content">


                        {/* DESCRIPTION */}

                        <section className="problem-section">

                            <h2>
                                Description
                            </h2>

                            <p>
                                {problem.description}
                            </p>

                        </section>



                        {/* EXAMPLES */}

                        {problem.examples?.length > 0 && (

                            <section className="problem-section">

                                <h2>
                                    Examples
                                </h2>


                                {problem.examples.map(
                                    (example, index) => (

                                        <div
                                            className="example-card"
                                            key={index}
                                        >

                                            <strong>
                                                Example{" "}
                                                {index + 1}
                                            </strong>


                                            <p>

                                                <b>
                                                    Input:
                                                </b>{" "}

                                                {example.input}

                                            </p>


                                            <p>

                                                <b>
                                                    Output:
                                                </b>{" "}

                                                {example.output}

                                            </p>


                                            {example.explanation && (

                                                <p>

                                                    <b>
                                                        Explanation:
                                                    </b>{" "}

                                                    {example.explanation}

                                                </p>

                                            )}

                                        </div>

                                    )
                                )}

                            </section>

                        )}



                        {/* CONSTRAINTS */}

                        {problem.constraints?.length > 0 && (

                            <section className="problem-section">

                                <h2>
                                    Constraints
                                </h2>


                                <ul>

                                    {problem.constraints.map(
                                        (constraint, index) => (

                                            <li key={index}>
                                                {constraint}
                                            </li>

                                        )
                                    )}

                                </ul>

                            </section>

                        )}

                    </div>

                </section>



                {/* RIGHT SIDE - EDITOR */}

                <section className="editor-panel">


                    {/* EDITOR HEADER */}

                    <div className="editor-header">

                        <span>
                            C++ Editor
                        </span>


                        <div className="editor-actions">


                            <button
                                className="run-button"
                                onClick={handleRunCode}
                                disabled={
                                    running ||
                                    submitting
                                }
                            >

                                {running
                                    ? "Running..."
                                    : "Run Code"}

                            </button>


                            <button
                                className="submit-button"
                                onClick={handleSubmit}
                                disabled={
                                    running ||
                                    submitting
                                }
                            >

                                {submitting
                                    ? "Submitting..."
                                    : "Submit"}

                            </button>


                        </div>

                    </div>



                    {/* CODE EDITOR */}

                    <textarea
                        className="code-editor"
                        value={code}
                        onChange={(e) =>
                            setCode(
                                e.target.value
                            )
                        }
                        spellCheck="false"
                    />



                    {/* OUTPUT */}

                    <div className="output-panel">

                        <div className="output-title">
                            Output
                        </div>


                        {verdict && (

                            <div className="verdict">

                                Verdict: {verdict}

                            </div>

                        )}


                        <pre>
                            {output ||
                                "Run your code to see the output here."}
                        </pre>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default ProblemDetails;