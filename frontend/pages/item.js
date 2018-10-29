import PropTypes from 'prop-types';

import SingleItem from '../components/SingleItem';

const Item = ({ query }) => (
  <div>
    <SingleItem id={query.id} />
  </div>
);

Item.propTypes = {
  query: PropTypes.object
};

export default Item;
