import Close from '@material-ui/icons/Close'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import * as React from 'react'

interface IState{
    videoList:any
}

interface IProps{
    play:any,
    mount:any,
}

export default class VideoList extends React.Component<IProps,IState>{
    public constructor(props:any){
        super(props);
        this.state = {
            videoList: [],
        }
        this.updateList();
    }

    public componentDidMount = () =>{
        this.props.mount(this.updateList)
    }


    public playVideo = (movie:object) => {
        this.props.play(movie)
    }

    public updateList = () => {
        fetch('https://msamymoviesdevops.azurewebsites.net/api/Movies',{
            method:'GET'
        }).then((response:any) => {
            return response.json();
        }).then((response:any)=>{
            const output:any[] = []
            /* <img src ="https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg"/> */
            response.forEach((video:any) => {
                const row = (<tr>
                    <td className="align-middle" onClick={() => this.handleLike(video)}>{video.isFavourite === true?<Star/>:<StarBorder/>}</td>
                    <td className="align-middle" onClick={() => this.playVideo(video)}><img src={"https://image.tmdb.org/t/p/w500/"+video.thumbnailUrl} width="100px" alt="Thumbnail"/></td>
                    <td className="align-middle" onClick={() => this.playVideo(video)}><b>{video.movieTitle}</b></td>
                    <td className="align-middle video-list-close"><button onClick={() => this.deleteVideo(video.movieId)}><Close/></button></td>}                                    
                    </tr>)
                if(video.isFavourite){
                    output.unshift(row);
                }else{
                    output.push(row);
                }
            })
            this.setState({videoList:output})
            });
    }

    public deleteVideo = (id:any) => {
        fetch("https://msamymoviesdevops.azurewebsites.net/api/Movies/"+id,{
            method:"DELETE"
        }).then(()=>{
            this.updateList()
        })
    }

    public handleLike = (video:any) =>{
        const toSend = [{
            "from":"",
            "op":"replace",
            "path":"/isFavourite",
            "value":!video.isFavourite,
        }]
        fetch("https://msamymoviesdevops.azurewebsites.net/api/Movies/update/"+video.movieId,{
            body:JSON.stringify(toSend),
            headers: {
                Accept: "text/plain",
                "Content-Type":"application/json-patch+json"
            },
            method:"PATCH"
        }).then(()=>{this.updateList()})
    }

    public render() {
        return (
            <div className="video-list">
            <h1 className="play-heading"><span className="blue-heading">movie</span>history</h1>
            <table className="table">
                {this.state.videoList}
            </table>
            </div>
        )
    }
}