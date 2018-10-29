import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Head from 'next/head';

import ErrorMessage from './ErrorMessage';

const SingleItemStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: 1200px;
  min-height: 800px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

class SingleItem extends Component {
  render() {
    const { id } = this.props;

    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <ErrorMessage error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No Item Found for {id}</p>;

          const { item } = data;

          return (
            <SingleItemStyles>
              <Head>
                <title>Sick Fits | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing: {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          );
        }}
      </Query>
    );
  }
}

SingleItem.propTypes = {
  id: PropTypes.string
};

export default SingleItem;
