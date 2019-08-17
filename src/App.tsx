import * as React from 'react';
import CaptionArea from 'src/Components/CaptionArea';
import Header from 'src/Components/Header';
import VideoList from 'src/Components/VideoList';
import 'src/App.css'
import * as Webcam from "react-webcam";


interface IState {
    playingUrl:any,
    updateVideoList:any,
    refCamera: any
    authenticated: boolean
    predictionResult: any
}

class App extends React.Component<{}, IState>{
  public constructor(props: any) {
    super(props);
    this.state = {
      playingUrl:"",
      updateVideoList:null,
      refCamera: React.createRef(),
      authenticated: false,
      predictionResult: null
    }
    this.authenticate = this.authenticate.bind(this)
  }

  public addVideo = (url:any) =>{
    const body = {"url":url}
    fetch("https://msamymoviesdevops.azurewebsites.net/api/Movies",{
      body:JSON.stringify(body),
      headers:{
        Accept:"text/plain",
        "Content-Type":"application/json"
      },
      method:"POST"
    }).then(()=>{
      this.state.updateVideoList()
    })
  }

  public updateURL = (url:object) => {
    if(this.state.playingUrl === url){
      this.setState({playingUrl:""},()=>this.setState({playingUrl:url}))
    }else{
      this.setState({playingUrl:url})
    }
  }

  public videoList = (callback:any) => {
    this.setState({updateVideoList:callback})
  }

  public render() {
    const { authenticated } = this.state
    return (
    <div>
      <div>
        {(!authenticated) ?
          <div>
            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              ref={this.state.refCamera}
            />
            <div className="row nav-row">
              <div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
            </div>
          </div>
        : ""}
        {(authenticated) ?
          <div>
            <Header addVideo={this.addVideo} />
            <div className="container">
              <div className="row">
                <div className="col-7">
                  <h1>{"Directed by " + this.state.playingUrl.director + " Starring " + this.state.playingUrl.cast}</h1>
                    <div>
                    <p> {this.state.playingUrl.plot} </p>
                    </div>  
                </div>
                <div className="col-5">
                  <VideoList play = {this.updateURL} mount={this.videoList}/>
                </div>
            </div>    
            <CaptionArea play={this.updateURL} currentVideo={this.state.playingUrl}/>
            </div>
          </div>
        : ""}
      </div>
    </div>)
    }
      // Authenticate
  private authenticate() {
    const screenshot = this.state.refCamera.current.getScreenshot();
    this.getFaceRecognitionResult(screenshot);
  }

    // Call custom vision model
    private getFaceRecognitionResult(image: string) {
      const url = "https://australiaeast.api.cognitive.microsoft.com/customvision/v3.0/Prediction/e4ee5c57-23c3-4bc4-9004-a646af0d2603/classify/iterations/Iteration1/image"
      if (image === null) {
          return;
      }
      const base64 = require('base64-js');
      const base64content = image.split(";")[1].split(",")[1]
      const byteArray = base64.toByteArray(base64content);
      fetch(url, {
          body: byteArray,
          headers: {
              'cache-control': 'no-cache', 'Prediction-Key': 'e645c649c79d43d6ba113cf99ca69dde', 'Content-Type': 'application/octet-stream'
          },
          method: 'POST'
      })
          .then((response: any) => {
              if (!response.ok) {
                  // Error State
                  alert(response.statusText)
              } else {
                  response.json().then((json: any) => {
                      console.log(json.predictions[0])
  
                      this.setState({ predictionResult: json.predictions[0] })
                      if (this.state.predictionResult.probability > 0.7) {
                          this.setState({ authenticated: true })
                      } else {
                          this.setState({ authenticated: false })
                          console.log(json.predictions[0].tagName)
                      }
                  })
              }
          })
        }
}


export default App;