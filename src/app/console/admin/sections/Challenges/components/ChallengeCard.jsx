"use client";

import NormalChallenge from "./NormalChallenge";
import InstanceChallenge from "./InstanceChallenge";

const ChallengeCard = ({
  challenge,
  togglingId,
  onToggleVisibility,
  onDeleteChallenge,
  deletingId,
  onBuildInstance,
  buildingId
}) => {
  return (
    <div className="bg-white/10 rounded-lg p-4">
      {challenge.type === "instance" ? (
        <InstanceChallenge
          challenge={challenge}
          onToggleVisibility={onToggleVisibility}
          togglingId={togglingId}
          onDeleteChallenge={onDeleteChallenge}
          deletingId={deletingId}
          onBuildInstance={onBuildInstance}
          buildingId={buildingId}
        />
      ) : (
        <NormalChallenge
          challenge={challenge}
          onToggleVisibility={onToggleVisibility}
          togglingId={togglingId}
          onDeleteChallenge={onDeleteChallenge}
          deletingId={deletingId}
        />
      )}
    </div>
  );
};

export default ChallengeCard;
