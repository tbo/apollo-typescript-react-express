import * as React from 'react';
import styled from 'styled-components';
import SearchResult from './search-result';

const headerHeight = 60;

const HeaderNavigation = styled.header`
  background-color: white;
  margin-bottom: ${headerHeight}px;
`;

class Header extends React.Component {
  public state = { searchTerm: null };

  private setSearchTerm = (event) => this.setState({searchTerm: event.target.value});

  public render() {
    return (
      <HeaderNavigation>
        <nav
          className='navbar fixed-top navbar-expand-lg navbar-light scrolling-navbar white lighten-5'
          style={{height: headerHeight}}
        >
          <a className='navbar-brand' href='#'><strong>My Application</strong></a>
          <form style={{marginLeft: 40}}>
            <div className='md-form mt-0' style={{width: 500}}>
              <input
                className='form-control mr-sm-2'
                type='text'
                placeholder='Search Customer'
                onKeyUp={this.setSearchTerm}
              />
            </div>
          </form>
        </nav>
        {this.state.searchTerm && <SearchResult searchTerm={this.state.searchTerm} top={headerHeight + 1}/> }
      </HeaderNavigation>
    );
  }
}

export default Header;
