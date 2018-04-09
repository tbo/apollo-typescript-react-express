import * as React from 'react';
import styled from 'styled-components';
import SearchResult from './search-result';
import {withRouter, RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';
import User from './user';

const headerHeight = 60;

const HeaderNavigation = styled.header`
  background-color: white;
  margin-bottom: ${headerHeight}px;
`;

class Header extends React.Component<RouteComponentProps<any>> {
  public state = {searchTerm: null, location: null};

  private setSearchTerm = (event) =>
    this.setState({searchTerm: event.target.value, location: this.props.location.pathname})

  public static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.location.pathname !== prevState.location ?  {searchTerm: null} : null;
  }

  public render() {
    return (
      <HeaderNavigation>
        <nav
          className='navbar fixed-top navbar-expand-lg navbar-light scrolling-navbar white lighten-5'
          style={{height: headerHeight}}
        >
          <Link className='navbar-brand' to='/'><strong>My Application</strong></Link>
          <form style={{marginLeft: 40}}>
            <div className='md-form mt-0' style={{maxWidth: 500, width: '100%'}}>
              <input
                className='form-control mr-sm-2'
                type='text'
                placeholder='Search Customer'
                onKeyUp={this.setSearchTerm}
              />
            </div>
          </form>
          <div className='collapse navbar-collapse justify-content-end'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <User/>
              </li>
            </ul>
          </div>
        </nav>
        {this.state.searchTerm && <SearchResult searchTerm={this.state.searchTerm} top={headerHeight + 1}/> }
      </HeaderNavigation>
    );
  }
}

export default withRouter(Header);
