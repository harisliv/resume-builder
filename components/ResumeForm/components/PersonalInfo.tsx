import FullName from './PersonalInfoFields/FullName';
import Email from './PersonalInfoFields/Email';
import Phone from './PersonalInfoFields/Phone';
import Location from './PersonalInfoFields/Location';
import LinkedIn from './PersonalInfoFields/LinkedIn';
import Website from './PersonalInfoFields/Website';
import Summary from './PersonalInfoFields/Summary';
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
