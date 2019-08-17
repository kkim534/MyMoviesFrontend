import { IconButton } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Comment from '@material-ui/icons/Comment'

import * as React from 'react'

interface IState {
    input: string,
    result: any,
    body:any,
}

interface IProps {
    currentVideo:any,
    play: any
}

export default class CaptionArea extends React.Component<IProps, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            body:[],
            input:"",
            result:[],
        }
    }

    public search = () => {
        const toSend = {
            "url":this.state.input,
        }
        fetch("https://msamymoviesdevops.azurewebsites.net/api/Comments/"+this.props.currentVideo.movieId,{
            body:JSON.stringify(toSend),
            headers:{
                Accept:"text/plain",
                "Content-Type":"application/json-patch+json"
            },
            method:"POST"
        }).then((response:any)=>{
            this.updateComments()
        })
    }
    
    public updateComments = () => {
        fetch('https://msamymoviesdevops.azurewebsites.net/api/Comments',{
            method:'GET'
        }).then((response:any) => {
            return response.json();
        }).then((response:any)=>{
            const output:any[] = []
            response.forEach((element:any) => {
                const row = (<tr>
                    <td className="align-middle"><b>{element.comment}</b></td>
                    </tr>)
                output.push(row);
            })
            this.setState({result:output})
            });
    }

    public handleClick = (url:any,time:any) =>{
        window.scrollTo(0,0)
        this.props.play(url+"&t="+time+"s")
    }



    public render() {
        return (
            <div className="caption-area">
                <div className="caption-area">
                <div className="row">
                    <div className="col-2 justify-content-center align-self-center">
                        <h1><span className="red-heading">Comment</span></h1>
                    </div>
                    <div className="col-10">
                        
                        <TextField
                            id="Comment-Bar"
                            className="CommentBar"
                            placeholder="Leave a comment!"
                            margin="normal"
                            variant="outlined"
                            onChange={(event: any) => this.setState({ input: event.target.value })}
                            value={this.state.input}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton onClick={() => this.search()}>
                                        <Comment />
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                    </div>
                </div>
                <br/>
                <table className="table">
                    <tr>
                        <th>Comments:</th>
                    </tr>
                    <tbody className="captionTable">
                            {this.state.result}
                    </tbody>
                </table>
            </div>
            </div>
        )
    }
}