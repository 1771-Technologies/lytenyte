import React, { Component } from "react";

const bgImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEX5+fn///8pDrwNAAAAFElEQVQI12NgsP/AQAz+f4CBGAwAJIIdTTn0+w0AAAAASUVORK5CYII=";

export class ImageDiff extends Component {
  constructor() {
    super();
    this.handleImgLoad = this.handleImgLoad.bind(this);
  }

  componentWillMount() {
    this.setState({
      height: this.props.height,
      width: this.props.width,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      height: nextProps.height || this.state.height,
      width: nextProps.width || this.state.width,
    });
  }

  handleImgLoad(e) {
    if (!this.props.height && !this.props.width) {
      const { height, width } = e.target;
      this.setState({
        height,
        width,
      });
    }
  }

  render() {
    return (
      <div
        className="ImageDiff"
        style={{ display: "inline-block", height: this.state.height, width: this.state.width }}
      >
        {this.props.type === "difference" ? this.renderDifference() : null}
        {this.props.type === "fade" ? this.renderFade() : null}
        {this.props.type === "swipe" ? this.renderSwipe() : null}
      </div>
    );
  }

  renderDifference() {
    const style = {
      position: "relative",
    };
    const beforeStyle = {
      position: "absolute",
      top: 0,
      left: 0,
    };
    const afterStyle = {
      ...beforeStyle,
    };

    return (
      <div className="ImageDiff_inner--difference" style={style}>
        <div className="ImageDiff__before" style={beforeStyle}>
          <img
            src={this.props.before}
            height={this.props.height}
            width={this.props.width}
            onLoad={this.handleImgLoad}
          />
        </div>
        <div className="ImageDiff__after" style={afterStyle}>
          <img
            src={this.props.after}
            height={this.props.height}
            width={this.props.width}
            style={{ mixBlendMode: "difference" }}
            onLoad={this.handleImgLoad}
          />
        </div>
      </div>
    );
  }

  renderFade = () => {
    const style = {
      backgroundImage: `url(${bgImage})`,
      height: this.state.height,
      margin: 0,
      position: "absolute",
      width: this.state.width,
    };

    const beforeStyle = {
      border: "1px solid #f77",
      ...style,
    };

    const afterStyle = {
      border: "1px solid #63c363",
      opacity: 1 - this.props.value,
      ...style,
    };

    return (
      <div className="ImageDiff__inner--fade" style={style}>
        <div className="ImageDiff__before" style={beforeStyle}>
          <img
            src={this.props.before}
            height={this.props.height}
            width={this.props.width}
            onLoad={this.handleImgLoad}
          />
        </div>
        <div className="ImageDiff__after" style={afterStyle}>
          <img
            src={this.props.after}
            height={this.props.height}
            width={this.props.width}
            onLoad={this.handleImgLoad}
          />
        </div>
      </div>
    );
  };

  renderSwipe() {
    const style = {
      backgroundImage: `url(${bgImage})`,
      height: this.state.height,
      margin: 0,
      position: "absolute",
      width: this.state.width,
    };

    const beforeStyle = {
      border: "1px solid #f77",
      ...style,
    };

    const afterStyle = {
      border: "1px solid #63c363",
      right: 0,
      ...style,
    };

    const swiperStyle = {
      borderLeft: "1px solid #999",
      height: this.state.height + 2,
      margin: 0,
      overflow: "hidden",
      position: "absolute",
      right: -2,
      width: this.state.width * (1 - this.props.value),
    };

    return (
      <div className="ImageDiff__inner--swipe" style={style}>
        <div className="ImageDiff__before" style={beforeStyle}>
          <img
            src={this.props.before}
            height={this.props.height}
            width={this.props.width}
            onLoad={this.handleImgLoad}
          />
        </div>
        <div className="ImageDiff--swiper" style={swiperStyle}>
          <div className="ImageDiff__after" style={afterStyle}>
            <img
              src={this.props.after}
              height={this.props.height}
              width={this.props.width}
              onLoad={this.handleImgLoad}
            />
          </div>
        </div>
      </div>
    );
  }
}

ImageDiff.defaultProps = {
  value: 1,
};
