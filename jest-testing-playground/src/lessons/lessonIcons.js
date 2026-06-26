// Maps each lesson (and each track) to a Material UI icon, so the app can show
// clean iconography instead of emoji.
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import DataObjectOutlinedIcon from "@mui/icons-material/DataObjectOutlined";
import FunctionsOutlinedIcon from "@mui/icons-material/FunctionsOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import TheaterComedyOutlinedIcon from "@mui/icons-material/TheaterComedyOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const lessonIcons = {
  // Foundations
  "why-test-at-all": ShieldOutlinedIcon,
  "what-is-jest": SmartToyOutlinedIcon,
  "how-jest-works": SettingsOutlinedIcon,
  "what-to-test": TuneOutlinedIcon,
  tdd: LoopOutlinedIcon,
  "tests-on-a-team": GroupsOutlinedIcon,
  // Hands-on Skills
  "your-first-test": RocketLaunchOutlinedIcon,
  "matchers-tobe-toequal": CompareArrowsOutlinedIcon,
  truthiness: ToggleOnOutlinedIcon,
  "numbers-and-strings": NumbersOutlinedIcon,
  "arrays-and-objects": DataObjectOutlinedIcon,
  "testing-functions-and-errors": FunctionsOutlinedIcon,
  "setup-and-teardown": CleaningServicesOutlinedIcon,
  "organizing-with-describe": AccountTreeOutlinedIcon,
  "async-testing": ScheduleOutlinedIcon,
  mocking: TheaterComedyOutlinedIcon,
};

export const trackIcons = {
  Foundations: PsychologyOutlinedIcon,
  "Hands-on Skills": HandymanOutlinedIcon,
};

export function getLessonIcon(slug) {
  return lessonIcons[slug] || HelpOutlineIcon;
}

export default lessonIcons;
