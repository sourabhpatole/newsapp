import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
export default class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 5,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      page: 1,
      totalResults: 0,
      loading: true,
    };
    document.title = `NewsMonkey-${this.capitalize(this.props.category)}`;
  }
  async updateNews() {
    this.props.setProgress(5);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}
    &pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(10);
    let parseData = await data.json();
    this.props.setProgress(50);
    this.setState({
      articles: parseData.articles,
      loading: false,
      totalResults: parseData.totalResults,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e42a8f3e91ec41f09aa3cc1ee18b9626&page=1
    // &pageSize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    // let data = await fetch(url);
    // let parseData = await data.json();
    // console.log(parseData);
    // this.setState({ articles: parseData.articles, loading: false });
    this.updateNews();
  }
  handleNext = async () => {
    // console.log("next clicked");
    // if (
    //   !(
    //     this.state.page + 1 >
    //     Math.ceil(this.state.totalResults / this.props.pageSize)
    //   )
    // ) {
    //   let url = `https://newsapi.org/v2/top-headlines?country=${
    //     this.props.country
    //   }&category=${this.props.category}&category=${
    //     this.props.category
    //   }&apiKey=e42a8f3e91ec41f09aa3cc1ee18b9626&page=${
    //     this.state.page + 1
    //   }&pageSize=${this.props.pageSize}`;
    //   this.setState({ loading: true });
    //   let data = await fetch(url);
    //   let parseData = await data.json();
    //   this.setState({
    //     page: this.state.page + 1,
    //     articles: parseData.articles,
    //     totalResults: parseData.totalResults,
    //     loading: false,
    //   });
    this.setState({ page: this.state.page + 1 });
    this.updateNews();
  };
  handlePrev = async () => {
    // console.log("prev clicked");
    // let url = `https://newsapi.org/v2/top-headlines?country=${
    //   this.props.country
    // }&category=${this.props.category}&category=${
    //   this.props.category
    // }&category=${
    //   this.props.category
    // }&apiKey=e42a8f3e91ec41f09aa3cc1ee18b9626&page=${
    //   this.state.page - 1
    // }&pageSize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    // let data = await fetch(url);
    // let parseData = await data.json();
    // console.log(parseData);
    // this.setState({
    //   page: this.state.page - 1,
    //   articles: parseData.articles,
    //   loading: false,
    // });
    this.setState({ page: this.state.page - 1 });
    this.updateNews();
  };

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e42a8f3e91ec41f09aa3cc1ee18b9626&page=${this.state.page}
    &pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parseData = await data.json();
    console.log(parseData);
    this.setState({
      articles: this.state.articles.concat(parseData.articles),
      totalResults: parseData.totalResults,
    });
  };

  render() {
    return (
      <>
        <div className="container">
          <h2> Top Headlines </h2>
          <p>
            on <strong>{this.capitalize(this.props.category)}</strong> Category
          </p>
        </div>
        {this.state.loading && <Spinner />}
        <div>
          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={<Spinner />}
          >
            <div className="container">
              <div className="row">
                {this.state.articles.map((element) => {
                  return (
                    <div className="col-md-4 " key={element.url}>
                      <NewsItem
                        title={element.title ? element.title.slice(0, 44) : ""}
                        description={
                          element.description
                            ? element.description.slice(0, 88)
                            : ""
                        }
                        imageUrl={element.urlToImage}
                        newsUrl={element.url}
                        author={element.author}
                        date={element.publishedAt}
                        source={element.source.name}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </InfiniteScroll>
        </div>

        {/* <div className="container d-flex justify-content-around">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.handlePrev}
            disabled={this.state.page <= 1}
          >
            &larr; Prev
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.handleNext}
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
          >
            Next &rarr;
          </button>
        </div> */}
      </>
    );
  }
}
