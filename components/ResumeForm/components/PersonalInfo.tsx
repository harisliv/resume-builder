import {
  FullName,
  Email,
  Phone,
  Location,
  LinkedIn,
  Website,
  Summary
} from './PersonalInfoFields';
import SectionTitle from './SectionTitle';
import FieldRow from './FieldRow';

export default function PersonalInfo() {
  return (
    <div className="space-y-4">
      <SectionTitle>Personal Information</SectionTitle>
      <FullName />
      <FieldRow cols="half">
        <Email />
        <Phone />
      </FieldRow>
      <Location />
      <FieldRow cols="half">
        <LinkedIn />
        <Website />
      </FieldRow>
      <Summary />
    </div>
  );
}
