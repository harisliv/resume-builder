import { describe, expect, it } from 'vitest';
import { COLORS, createStyles } from '../ResumeStyles';

describe('ResumeStyles', () => {
  describe('COLORS', () => {
    it('has a white background', () => {
      expect(COLORS.background).toBe('#ffffff');
    });

    it('has defined accent colors', () => {
      expect(COLORS.cyan).toBeDefined();
      expect(COLORS.violet).toBeDefined();
      expect(COLORS.fuchsia).toBeDefined();
      expect(COLORS.rose).toBeDefined();
    });

    it('has defined text colors', () => {
      expect(COLORS.textPrimary).toBeDefined();
      expect(COLORS.textSecondary).toBeDefined();
      expect(COLORS.textMuted).toBeDefined();
      expect(COLORS.textDark).toBeDefined();
    });

    it('has card styling colors', () => {
      expect(COLORS.cardBg).toBeDefined();
      expect(COLORS.cardBorder).toBeDefined();
    });
  });

  describe('createStyles', () => {
    const styles = createStyles();

    describe('Page Styles', () => {
      it('has page styles defined', () => {
        expect(styles.page).toBeDefined();
      });

      it('uses the correct background color', () => {
        expect(styles.page.backgroundColor).toBe(COLORS.background);
      });

      it('has bottom padding for page number', () => {
        expect(styles.page.paddingBottom).toBeGreaterThan(0);
      });
    });

    describe('Header Styles', () => {
      it('has header styles defined', () => {
        expect(styles.header).toBeDefined();
      });

      it('has name styles defined', () => {
        expect(styles.name).toBeDefined();
      });

      it('has contactRow styles defined', () => {
        expect(styles.contactRow).toBeDefined();
      });

      it('has contactItem styles defined', () => {
        expect(styles.contactItem).toBeDefined();
      });

      it('header has proper padding', () => {
        expect(styles.header.paddingBottom).toBeGreaterThanOrEqual(24);
      });
    });

    describe('Body Styles', () => {
      it('has body styles defined', () => {
        expect(styles.body).toBeDefined();
      });

      it('has padding on the body', () => {
        expect(styles.body.paddingTop).toBeGreaterThan(0);
      });
    });

    describe('Section Styles', () => {
      it('has section styles defined', () => {
        expect(styles.section).toBeDefined();
      });

      it('has sectionHeader styles defined', () => {
        expect(styles.sectionHeader).toBeDefined();
      });

      it('has sectionTitle styles defined', () => {
        expect(styles.sectionTitle).toBeDefined();
      });

      it('has sectionIconBox styles defined', () => {
        expect(styles.sectionIconBox).toBeDefined();
      });

      it('has different icon box color variants', () => {
        expect(styles.sectionIconBoxCyan).toBeDefined();
        expect(styles.sectionIconBoxViolet).toBeDefined();
        expect(styles.sectionIconBoxFuchsia).toBeDefined();
      });
    });

    describe('Experience Styles', () => {
      it('has experienceContainer styles defined', () => {
        expect(styles.experienceContainer).toBeDefined();
      });

      it('has experienceItem styles defined', () => {
        expect(styles.experienceItem).toBeDefined();
      });

      it('has timelineDot styles defined', () => {
        expect(styles.timelineDot).toBeDefined();
      });

      it('has position styles defined', () => {
        expect(styles.position).toBeDefined();
      });

      it('has company styles defined', () => {
        expect(styles.company).toBeDefined();
      });

      it('has description styles defined', () => {
        expect(styles.description).toBeDefined();
      });
    });

    describe('Education Styles', () => {
      it('has educationItem styles defined', () => {
        expect(styles.educationItem).toBeDefined();
      });

      it('has degree styles defined', () => {
        expect(styles.degree).toBeDefined();
      });

      it('has institution styles defined', () => {
        expect(styles.institution).toBeDefined();
      });

      it('has gpa styles defined', () => {
        expect(styles.gpa).toBeDefined();
      });
    });

    describe('Skills Styles', () => {
      it('has skillsContainer styles defined', () => {
        expect(styles.skillsContainer).toBeDefined();
      });

      it('has skillTag styles defined', () => {
        expect(styles.skillTag).toBeDefined();
      });

      it('skills container uses flexWrap', () => {
        expect(styles.skillsContainer.flexWrap).toBe('wrap');
      });
    });

    describe('Card Styles', () => {
      it('has card styles defined', () => {
        expect(styles.card).toBeDefined();
      });

      it('has cardHeader styles defined', () => {
        expect(styles.cardHeader).toBeDefined();
      });

      it('card has border radius', () => {
        expect(styles.card.borderRadius).toBeGreaterThan(0);
      });

      it('card has background color', () => {
        expect(styles.card.backgroundColor).toBe(COLORS.cardBg);
      });
    });

    describe('Summary Styles', () => {
      it('has summarySection styles defined', () => {
        expect(styles.summarySection).toBeDefined();
      });

      it('has summaryText styles defined', () => {
        expect(styles.summaryText).toBeDefined();
      });

      it('summary has accent border', () => {
        expect(styles.summarySection.borderLeft).toBeDefined();
      });
    });

    describe('Page Number Styles', () => {
      it('has pageNumber styles defined', () => {
        expect(styles.pageNumber).toBeDefined();
      });

      it('page number is positioned at bottom', () => {
        expect(styles.pageNumber.position).toBe('absolute');
        expect(styles.pageNumber.bottom).toBeDefined();
      });
    });

    describe('Contact Link Styles', () => {
      it('has contactLink styles defined', () => {
        expect(styles.contactLink).toBeDefined();
      });

      it('contact link has no text decoration', () => {
        expect(styles.contactLink.textDecoration).toBe('none');
      });
    });
  });

  describe('Style Consistency', () => {
    const styles = createStyles();

    it('all padding values are numbers', () => {
      const paddedElements = [
        styles.page,
        styles.header,
        styles.body,
        styles.card,
        styles.skillTag
      ];
      paddedElements.forEach((element) => {
        if ('padding' in element && element.padding !== undefined) {
          expect(typeof element.padding).toBe('number');
        }
      });
    });

    it('all font sizes are numbers', () => {
      const textElements = [
        styles.name,
        styles.sectionTitle,
        styles.position,
        styles.company,
        styles.description,
        styles.skillTag
      ];
      textElements.forEach((element) => {
        if (element.fontSize !== undefined) {
          expect(typeof element.fontSize).toBe('number');
        }
      });
    });

    it('uses consistent font family', () => {
      expect(styles.page.fontFamily).toBe('Inter');
    });
  });
});
