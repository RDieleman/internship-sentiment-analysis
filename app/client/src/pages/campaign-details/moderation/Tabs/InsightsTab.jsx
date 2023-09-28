import "../Style.css";
import Header from "../../../../components/text/Header";
import Progress from "../../../../components/progress/Progress";

const InsightsTab = ({ feedback }) => {
  return (
    <div className="insights-container">
      <div>
        <Header value="Campaign Vision" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
          rutrum lacus non felis fermentum, quis varius dolor vestibulum. Donec
          ac imperdiet libero. Nulla facilisi. Vivamus facilisis, nunc in
          interdum elementum, arcu metus pellentesque nisl, sit amet sagittis
          mauris nisi sit amet nulla.
        </p>
      </div>
      <hr />
      <div>
        <Header value="Event" />
        <p>
          The event aimed to contribute to the campaign's progress in the
          following ADKAR step:
        </p>
        <Progress
          steps={[
            {
              name: "Awareness",
              active: true,
              info: (
                <>
                  <p>
                    The purpose of this step is to make sure everyone
                    understands why the change is necessary. Without a clear
                    understanding of the need for change, people might resist it
                    or lack motivation to engage with it.
                  </p>
                  <p>
                    This could involve communication and education efforts, such
                    as town hall meetings, emails, newsletters, or one-on-one
                    conversations that explain the reasons for the change and
                    its benefits. For example, if a company is implementing a
                    new software system, they might explain how the current
                    system is outdated and inefficient and how the new system
                    will help improve productivity.
                  </p>
                </>
              ),
            },
            {
              name: "Desire",
              info: (
                <>
                  <p>
                    The aim of the desire step is to cultivate a positive
                    attitude toward the change. Even if people understand the
                    need for change, they won't truly engage with it unless they
                    want the change to happen.
                  </p>
                  <p>
                    This might involve efforts to address concerns, answer
                    questions, highlight the benefits of the change for
                    individuals, and create a positive vision of the future.
                    Continuing the software system example, this might involve
                    demonstrating how the new system will make individuals' work
                    easier or more enjoyable.
                  </p>
                </>
              ),
            },
            {
              name: "Knowledge",
              info: (
                <>
                  <p>
                    The knowledge step is about providing the necessary
                    information, training, and resources to make the change.
                    People need to know what to do in order to make a change.
                    They need the right skills and knowledge.
                  </p>
                  <p>
                    This often involves training sessions, manuals, online
                    resources, or mentoring programs. In the software system
                    example, this would involve training employees on how to use
                    the new system.
                  </p>
                </>
              ),
            },
            {
              name: "Ability",
              info: (
                <>
                  <p>
                    The ability step involves making sure that people are able
                    to implement the change in their day-to-day work.
                    Understanding how to change and being able to effectively
                    implement it are different. This step ensures that employees
                    can practically apply their knowledge and skills in the new
                    environment.
                  </p>
                  <p>
                    This might involve providing support during the initial
                    phase of the change, such as help desks, additional
                    resources, or coaching. In the software example, this could
                    involve a period of on-the-job support while employees get
                    used to the new system.
                  </p>
                </>
              ),
            },
            {
              name: "Reinforcement",
              info: (
                <>
                  <p>
                    The aim of the reinforcement step is to make the change
                    stick and become 'the new normal'. Without reinforcement,
                    people might revert back to their old ways of doing things.
                  </p>
                  <p>
                    This could involve recognition, rewards, positive feedback,
                    or other forms of reinforcement that encourage the new
                    behaviors. In the software system example, this could
                    involve celebrating successes with the new system,
                    recognizing individuals who are using it effectively, or
                    providing ongoing support and resources.
                  </p>
                </>
              ),
            },
          ]}
        />
      </div>
      <hr />
      <div>
        <Header value="Message" />
        <p>"{feedback.content}"</p>
      </div>
      <hr />
      <div>
        <Header value="Reaction" />
        <p>
          This reponds to the campaign event indicates the following step on the
          change curve:
        </p>
        <Progress
          steps={[
            {
              name: "Shock",
              info: "If someone reacts with shock, it is best to respond with clarification. For example...",
            },
            {
              name: "Denial",
              info: "If someone reacts with denail, it is best to respond with clarification. For example...",
            },
            {
              name: "Anger",
              info: "If someone reacts with anger, it is best to respond with emotional support. For example...",
              active: true,
            },
            {
              name: "Sadness",
              info: "If someone reacts with shock, it is best to respond with emotional support. For example...",
            },
            {
              name: "Acceptance",
              info: "If someone reacts with acceptance, it is best to respond with direction and guidance. For example...",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default InsightsTab;
