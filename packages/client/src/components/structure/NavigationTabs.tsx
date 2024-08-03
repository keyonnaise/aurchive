import { IconType } from '~components/atom/Icon';
import Tabs from '~components/navigation/Tabs';

type ColorScheme = 'netural' | 'dark' | 'light';

interface NonIndexedMenu {
  label: string;
  icon?: IconType;
  to: string;
  isDisabled?: boolean;
  children?: undefined;
}

interface Props {
  colorScheme: ColorScheme;
  menus: NonIndexedMenu[];
}

function NavigationTabs({ colorScheme, menus }: Props) {
  return (
    <Tabs colorScheme={colorScheme}>
      {menus.map(({ label, to, isDisabled }, i) => (
        <Tabs.Item as="anchor" key={i} to={to} isDisabled={isDisabled}>
          {label}
        </Tabs.Item>
      ))}
    </Tabs>
  );
}

export default NavigationTabs;
