import {
  OptionIconWrapper,
  OptionDetail,
  OptionDescription
} from '../styles/nav-selector.styles';
import type { NavSelectorOption } from '../types';

type Props<T extends string> = {
  option: NavSelectorOption<T>;
  Icon?: React.ComponentType<{ option: NavSelectorOption }>;
};

export function NavSelectorOptionContent<T extends string>({
  option,
  Icon
}: Props<T>) {
  return (
    <>
      {Icon ? (
        <OptionIconWrapper>
          <Icon option={option} />
        </OptionIconWrapper>
      ) : null}
      <OptionDetail>
        <span>{option.label}</span>
        {option.description ? (
          <OptionDescription>{option.description}</OptionDescription>
        ) : null}
      </OptionDetail>
    </>
  );
}
