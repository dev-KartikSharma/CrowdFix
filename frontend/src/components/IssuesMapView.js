import React, { useState } from 'react';
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

const IssuesMapView = ({ issues }) => {
    const defaultPosition = { lat: 28.6139, lng: 77.2090 }; // Delhi
    const [selectedIssueId, setSelectedIssueId] = useState(null);
    
    // --- 1. Add new state to track the hovered issue ---
    const [hoveredIssueId, setHoveredIssueId] = useState(null);

    // Find the full issue object for both clicked and hovered states
    const selectedIssue = issues.find(issue => issue.id === selectedIssueId);
    const hoveredIssue = issues.find(issue => issue.id === hoveredIssueId);

    return (
        <div style={{ height: '80vh', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <Map
                defaultCenter={defaultPosition}
                defaultZoom={11}
                mapId="issues-overview-map"
                gestureHandling={'greedy'}
                // --- 2. Clear hover state when the mouse leaves the map area ---
                onMouseLeave={() => setHoveredIssueId(null)}
            >
                {issues.map(issue => (
                    issue.geotag && (
                        <AdvancedMarker
                            key={issue.id}
                            position={{ lat: issue.geotag.latitude, lng: issue.geotag.longitude }}
                            // --- 3. Add event handlers for click and hover ---
                            onClick={() => setSelectedIssueId(issue.id)}
                            onPointerEnter={() => setHoveredIssueId(issue.id)}
                        />
                    )
                ))}

                {/* This is the InfoWindow that appears ON HOVER */}
                {hoveredIssue && !selectedIssue && (
                     <InfoWindow
                        position={{ lat: hoveredIssue.geotag.latitude, lng: hoveredIssue.geotag.longitude }}
                        // We don't add onCloseClick so it closes automatically on mouse-out
                     >
                         <div>
                             <strong className="block uppercase text-indigo-600">{hoveredIssue.category}</strong>
                             <p className="text-gray-800">{hoveredIssue.description}</p>
                         </div>
                     </InfoWindow>
                )}

                {/* This is the InfoWindow that appears ON CLICK (and stays open) */}
                {selectedIssue && (
                    <InfoWindow
                        position={{ lat: selectedIssue.geotag.latitude, lng: selectedIssue.geotag.longitude }}
                        onCloseClick={() => setSelectedIssueId(null)}
                    >
                        <div>
                            <strong className="block uppercase text-indigo-600">{selectedIssue.category}</strong>
                            <p className="text-gray-800">{selectedIssue.description}</p>
                        </div>
                    </InfoWindow>
                )}
            </Map>
        </div>
    );
};

export default IssuesMapView;