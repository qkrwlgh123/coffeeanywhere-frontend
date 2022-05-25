import { Helmet } from 'react-helmet-async';
import { PropTypes } from 'prop-types';

function PageTitle({ title }) {
  return (
    <Helmet>
      <title>모두의 커피 | {title}</title>
    </Helmet>
  );
}
PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
