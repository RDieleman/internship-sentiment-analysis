import { useContext, useEffect, useState } from "react";
import FilterGroup from "../../../components/filter/FilterGroup";
import "./Style.css";
import { useFeedback } from "../../../hooks/useFeedback";
import FeedbackTable from "../../../components/table/FeedbackTable";
import Overlay from "../../../components/overlay/Overlay";
import FeedbackDetails from "./FeedbackDetail";
import CustomButton from "../../../components/input/button/CustomButton";
import { useModeration } from "../../../hooks/useModeration";
import { useSearchParams } from "react-router-dom";
import { CampaignContext } from "../../../contexts/CampaignContext.jsx";
import { AlertContext, AlertTypes } from "../../../contexts/AlertContext.jsx";

const defaultFilters = {
  0: {
    id: "SentimentFilter",
    name: "Sentiment",
    criteria: {
      0: {
        id: "PositiveCriterion",
        name: "Positive",
        isChecked: false,
        isMatch: (feedback) => {
          return feedback.analysis.sentiment === "Positive";
        },
      },
      1: {
        id: "NegativeCriterion",
        name: "Negative",
        isChecked: false,
        isMatch: (feedback) => {
          return feedback.analysis.sentiment === "Negative";
        },
      },
      2: {
        id: "NeutralCriterion",
        name: "Neutral",
        isChecked: false,
        isMatch: (feedback) => {
          return (
            feedback.analysis.sentiment === "Neutral" ||
            feedback.analysis.emotion === "Neutral"
          );
        },
      },
    },
  },
  1: {
    id: "UtilityFilter",
    name: "Utility",
    criteria: {
      0: {
        id: "QuestionCriterion",
        name: "Questions",
        isChecked: false,
        isMatch: (feedback) => {
          return feedback.analysis.is_question === true;
        },
      },
    },
  },
  2: {
    id: "EmotionFilter",
    name: "Emotions",
    criteria: {
      0: {
        id: "HapinessCriterion",
        name: "Hapiness",
        isChecked: false,
        isMatch: (feedback) => {
          return feedback.analysis.emotion === "Hapiness";
        },
      },
      1: {
        id: "AngerCriterion",
        name: "Anger",
        isChecked: false,
        isMatch: (feedback) => {
          return feedback.analysis.emotion === "Anger";
        },
      },
      2: {
        id: "SadnessCriterion",
        name: "Sadness",
        isChecked: false,
        isMatch: (feedback) => {
          return feedback.analysis.emotion === "Sadness";
        },
      },
      3: {
        id: "SurpriseCriterion",
        name: "Surprise",
        isChecked: false,
        isMatch: (feedback) => {
          return feedback.analysis.emotion === "Surprise";
        },
      },
      4: {
        id: "FearCriterion",
        name: "Fear",
        isChecked: false,
        isMatch: (feedback) => {
          return feedback.analysis.emotion === "Fear";
        },
      },
    },
  },
};

function ModerationOverview() {
  const { addAlert } = useContext(AlertContext);
  const { selectedCampaign } = useContext(CampaignContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const moderation = useModeration();
  const [filters, setFilters] = useState(defaultFilters);
  const [liked, setLiked] = useState(false);

  // Retrieve feedback data.
  const feedback = useFeedback({ selectedCampaign });

  useEffect(() => {
    if (moderation.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, "Failed to edit feedback.");
  }, [moderation.error]);

  useEffect(() => {
    if (feedback.error == null) {
      return;
    }

    addAlert(AlertTypes.ERROR, "Failed to retrieve feedback data.");
  }, [feedback.error]);

  useEffect(() => {
    if (!moderation.selectedFeedback) return;

    const updatedFeedback = feedback.data.find(
      (f) => f._id === moderation.selectedFeedback._id
    );
    moderation.setSelectedFeedback(updatedFeedback);
  }, [feedback.data]);

  // If present, get the selected feedback from the url.
  const feedbackId = searchParams.get("feedbackId");

  // If no feedback is provided, reset the stored feedback.
  const feedbackIsProvided = feedbackId != null;
  if (!feedbackIsProvided && moderation.selectedFeedback != null) {
    moderation.setSelectedFeedback(null);
  }

  // If the stored feedback is different, overwrite it.
  const storedFeedbackIsDifferent =
    moderation.selectedFeedback == null ||
    moderation.selectedFeedback._id !== feedbackId;
  if (feedbackIsProvided && storedFeedbackIsDifferent) {
    const providedFeedback = feedback.getById(feedbackId);

    if (providedFeedback != null) {
      moderation.setSelectedFeedback(providedFeedback);
    }
  }

  const handleOverlayClose = () => {
    searchParams.delete("feedbackId");
    setSearchParams(searchParams);
  };

  const handleOverlayOpen = (id) => {
    searchParams.append("feedbackId", id);
    setSearchParams(searchParams);
  };

  const handleFeedbackSelectChange = (id) => {
    if (id == null) {
      handleOverlayClose();
      return;
    }

    handleOverlayOpen(id);
  };

  const handleFiltersChanged = (filterKey, criterionKey, isChecked) => {
    setFilters((prev) => {
      const ob = {
        ...prev,
        [filterKey]: {
          ...prev[filterKey],
          criteria: {
            ...prev[filterKey].criteria,
            [criterionKey]: {
              ...prev[filterKey].criteria[criterionKey],
              isChecked: isChecked,
            },
          },
        },
      };
      return ob;
    });
  };

  let noFiltersApplied = true;
  for (let filterkey in Object.keys(filters)) {
    if (!noFiltersApplied) {
      break;
    }

    let filter = filters[filterkey];

    for (let criterionKey in Object.keys(filter.criteria)) {
      let criterion = filter.criteria[criterionKey];
      if (criterion.isChecked) {
        noFiltersApplied = false;
        break;
      }
    }
  }

  const filteredFeedback = noFiltersApplied
    ? feedback.data
    : feedback.data.reduce((acc, currentValue) => {
        for (let filterKey in Object.keys(filters)) {
          let filter = filters[filterKey];

          for (let criterionKey in Object.keys(filter.criteria)) {
            let criterion = filter.criteria[criterionKey];
            if (criterion.isChecked && criterion.isMatch(currentValue)) {
              acc.push(currentValue);
              return acc;
            }
          }
        }

        return acc;
      }, []);

  const isAssigned =
    moderation.selectedFeedback != null &&
    moderation.selectedFeedback.is_assigned == true;

  return (
    <>
      <div id="page" className="feedback-page">
        <span className="feedback-filter-pane">
          <FilterGroup
            filters={filters}
            onFiltersChanged={handleFiltersChanged}
          />
        </span>
        <span className="feedback-table-pane">
          <FeedbackTable
            items={filteredFeedback}
            selectedFeedback={moderation.selectedFeedback}
            onSelectionChange={(id) => {
              handleFeedbackSelectChange(id);
            }}
          />
        </span>
      </div>
      <Overlay
        contents={
          <>
            <FeedbackDetails feedback={moderation.selectedFeedback} />
            <div className="quick-actions-container">
              <CustomButton
                type="primary"
                style="squared"
                content={isAssigned ? "Unassign" : "Assign"}
                outlined={true}
                onPress={() => moderation.setAssigned()}
              />
              <CustomButton
                outlined={true}
                type="primary"
                style="squared"
                content={liked ? "Unlike" : "Like"}
                onPress={() => {
                  setLiked((prevValue) => !prevValue);
                }}
              />
              <CustomButton
                type="secondary"
                outlined={true}
                style="squared"
                content="Mark as Handled"
                onPress={async () => {
                  await moderation.setHandled();
                  handleOverlayClose();
                }}
              />
            </div>
          </>
        }
        isOpen={moderation.selectedFeedback != null}
        showCloseButton={true}
        onClose={handleOverlayClose}
      />
    </>
  );
}

export default ModerationOverview;
