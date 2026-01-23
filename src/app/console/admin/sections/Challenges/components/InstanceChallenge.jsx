"use client";

import { Trophy, Eye, EyeOff, Trash2 } from "lucide-react";
import InstanceControl from "./InstanceControl";

export default function InstanceChallenge({
  challenge,
  togglingId,
  onToggleVisibility,
  onDeleteChallenge,
  deletingId,
  buildingId,
  onBuildInstance,
}) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className=" flex flex-row gap-2 px-2 py-1 bg-white/80 text-black text-xs rounded-full ">
            <span className=" font-bold uppercase">{challenge.category} </span>
            <span className="font-semibold">Docker Instance</span>
          </span>

          <div className="flex items-center gap-1 px-2 py-1 bg-white/10 text-white text-xs font-medium rounded-full">
            <Trophy className="w-3 h-3" />
            {challenge.value}
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
              challenge.visible
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {challenge.visible ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            {challenge.visible ? "Live" : "Hidden"}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* <button
            onClick={() => onEdit(challenge)}
            className="p-2 text-white/70 hover:text-white rounded"
          >
            <Edit3 className="w-4 h-4" />
          </button> */}

          {challenge.instance.buildStatus === "built" ? (
            <button
              onClick={() =>
                onToggleVisibility(challenge._id, challenge.visible)
              }
              disabled={togglingId === challenge._id}
              className={`p-2 rounded ${
                challenge.visible
                  ? "text-red-400 hover:text-red-300"
                  : "text-green-400 hover:text-green-300"
              }`}
            >
              {togglingId === challenge._id ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : challenge.visible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          ) : (
            ""
          )}

          <button
            onClick={() => onDeleteChallenge(challenge._id)}
            disabled={deletingId === challenge._id}
            className="p-2 text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            {deletingId === challenge._id ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium text-white mb-1">
            {challenge.name}
          </h3>
          <p className="text-xs text-white/70 mb-2">by {challenge.author}</p>
          <p className="text-sm text-white/80">{challenge.description}</p>
        </div>

        <div className="space-y-3">
          <InstanceControl
            instance={challenge.instance}
            building={buildingId === challenge._id}
            onBuildInstance={() => onBuildInstance(challenge._id)}
          />
        </div>
      </div>
    </div>
  );
}
