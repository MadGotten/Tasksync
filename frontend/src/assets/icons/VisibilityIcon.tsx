import { Icon } from "@iconify-icon/react";

const VisibilityIcon = ({ showArchived }: { showArchived: boolean }) => (
  <Icon
    icon={
      showArchived
        ? "material-symbols:visibility-off-outline"
        : "material-symbols:visibility-outline"
    }
    width='20'
    height='20'
  />
);

export default VisibilityIcon;
