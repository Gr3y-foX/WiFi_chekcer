import React from 'react';

// Results component to display scan results
const Results = ({ results }) => {
    return (
        <div>
            <h2>Scan Results</h2>
            {results.length === 0 ? (
                <p>No vulnerabilities found.</p>
            ) : (
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>
                            <strong>Network:</strong> {result.networkName} <br />
                            <strong>Vulnerability:</strong> {result.vulnerability} <br />
                            <strong>Details:</strong> {result.details}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Results;