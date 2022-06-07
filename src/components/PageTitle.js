import { Helmet } from 'react-helmet-async';
import { PropTypes } from 'prop-types';

function PageTitle({ title }) {
  return (
    <Helmet>
      <title>커피 애니웨어 | {title}</title>
    </Helmet>
  );
}
PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
