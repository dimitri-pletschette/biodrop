import UserMilestone from "./UserMilestone";
import Alert from "@components/Alert";

export default function UserMilestones({ milestones, manage = false }) {
  const historicMilestones = milestones.filter(
    (milestone) => !milestone.isGoal
  );

  const futureMilestones = milestones.filter((milestone) => milestone.isGoal);
  const showDateFixAlert = milestones.some(milestone => isNaN(Date.parse(milestone.date)) || milestone.date.trim().match(/^[0-9]{4}$/))
  return (
    <>
      {!milestones?.length && (
        <Alert type="info" message="No Milestones found" />
      )}

      {showDateFixAlert &&  <div className="mt-4"> <Alert type="warning" message="Please update your milestone date" /> </div>}
      <ul role="list" className="divide-y divide-primary-low-medium mt-4">
        {milestones &&
          historicMilestones.map((milestone, key) => (
            <UserMilestone
              milestone={milestone}
              isGoal={false}
              key={key}
              manage={manage}
            />
          ))}
      </ul>

      {futureMilestones.length > 0 && (
        <div className="flex justify-center items-center gap-3 text-primary-medium-low dark:text-primary-low-medium my-4 text-xl p-4">
          Future Goals
        </div>
      )}

      <ul role="list" className="divide-y divide-primary-low mt-4">
        {futureMilestones.map((goal, key) => (
          <UserMilestone
            milestone={goal}
            isGoal={true}
            key={key}
            manage={manage}
          />
        ))}
      </ul>
    </>
  );
}
