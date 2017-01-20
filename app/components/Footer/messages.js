/*
 * Footer Messages
 *
 * This contains all the text for the Footer component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  licenseMessage: {
    id: 'boilerplate.components.Footer.license.message',
    defaultMessage: 'This project is MIT licensed.',
  },
  authorAdapterMessage: {
    id: 'boilerplate.components.Footer.authorAdapter.message',
    defaultMessage: `
      Adapted by {adapter}, original by {author}.
    `,
  },
});
