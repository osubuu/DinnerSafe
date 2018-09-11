import React from "react";

const Loader = () => {
  return (
    <div className="loader">
      <svg
        class="lds-spin"
        width="85px"
        height="85px"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        style={{ background: "none" }}
      >
        <g transform="translate(87,50)">
          <g transform="rotate(0)">
            <circle cx="0" cy="0" r="10" fill="rgb(243, 72, 67)" fillOpacity="1" transform="scale(1.24382 1.24382)">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="-0.875s"
                values="1.25 1.25;1 1"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fillOpacity"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
                values="1;0"
                begin="-0.875s"
              />
            </circle>
          </g>
        </g>
        <g transform="translate(76.16295090390226,76.16295090390226)">
          <g transform="rotate(45)">
            <circle cx="0" cy="0" r="10" fill="rgb(243, 72, 67)" fillOpacity="0.875" transform="scale(1.02507 1.02507)">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="-0.75s"
                values="1.25 1.25;1 1"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fillOpacity"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
                values="1;0"
                begin="-0.75s"
              />
            </circle>
          </g>
        </g>
        <g transform="translate(50,87)">
          <g transform="rotate(90)">
            <circle cx="0" cy="0" r="10" fill="rgb(243, 72, 67)" fillOpacity="0.75" transform="scale(1.05632 1.05632)">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="-0.625s"
                values="1.25 1.25;1 1"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fillOpacity"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
                values="1;0"
                begin="-0.625s"
              />
            </circle>
          </g>
        </g>
        <g transform="translate(23.837049096097743,76.16295090390226)">
          <g transform="rotate(135)">
            <circle cx="0" cy="0" r="10" fill="rgb(243, 72, 67)" fillOpacity="0.625" transform="scale(1.08757 1.08757)">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="-0.5s"
                values="1.25 1.25;1 1"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fillOpacity"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
                values="1;0"
                begin="-0.5s"
              />
            </circle>
          </g>
        </g>
        <g transform="translate(13,50.00000000000001)">
          <g transform="rotate(180)">
            <circle cx="0" cy="0" r="10" fill="rgb(243, 72, 67)" fillOpacity="0.5" transform="scale(1.11882 1.11882)">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="-0.375s"
                values="1.25 1.25;1 1"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fillOpacity"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
                values="1;0"
                begin="-0.375s"
              />
            </circle>
          </g>
        </g>
        <g transform="translate(23.837049096097736,23.837049096097743)">
          <g transform="rotate(225)">
            <circle cx="0" cy="0" r="10" fill="rgb(243, 72, 67)" fillOpacity="0.375" transform="scale(1.15007 1.15007)">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="-0.25s"
                values="1.25 1.25;1 1"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fillOpacity"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
                values="1;0"
                begin="-0.25s"
              />
            </circle>
          </g>
        </g>
        <g transform="translate(49.99999999999999,13)">
          <g transform="rotate(270)">
            <circle cx="0" cy="0" r="10" fill="rgb(243, 72, 67)" fillOpacity="0.25" transform="scale(1.18132 1.18132)">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="-0.125s"
                values="1.25 1.25;1 1"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fillOpacity"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
                values="1;0"
                begin="-0.125s"
              />
            </circle>
          </g>
        </g>
        <g transform="translate(76.16295090390226,23.837049096097736)">
          <g transform="rotate(315)">
            <circle cx="0" cy="0" r="10" fill="rgb(243, 72, 67)" fillOpacity="0.125" transform="scale(1.21257 1.21257)">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="0s"
                values="1.25 1.25;1 1"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fillOpacity"
                keyTimes="0;1"
                dur="0.5s"
                repeatCount="indefinite"
                values="1;0"
                begin="0s"
              />
            </circle>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Loader;
