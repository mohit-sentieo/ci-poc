import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../messages';
import Footer from '../index';
import A from 'components/A';

describe('<Footer />', () => {
  it('should render the copyright notice', () => {
    const renderedComponent = shallow(
      <Footer />
    );
    expect(renderedComponent.contains(
      <section>
        <FormattedMessage {...messages.licenseMessage} />
      </section>
    )).toEqual(true);
  });

  it('should render the credits', () => {
    const renderedComponent = shallow(<Footer />);
    expect(renderedComponent.contains(
      <section>
        <FormattedMessage
          {...messages.authorAdapterMessage}
          values={{
            adapter: <A href="https://twitter.com/jeffbski">Jeff Barczewski</A>,
            author: <A href="https://twitter.com/mxstbr">Max Stoiber</A>,
          }}
        />
      </section>
    )).toEqual(true);
  });
});
