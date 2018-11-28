import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

function IconPlay(props) {
  return (
    <span className="icon ion-md-play"></span>
  );
}

function IconPause(props) {
  return (
    <span className="icon ion-md-pause"></span>
  );
}

function IconNumber(props) {
  return (
    <span>{props.index + 1}</span>
  );
}

class Icon extends Component {
  render () {
    const currentSong = this.props.currentSong;
    const isPlaying = this.props.isPlaying;
    const hover = this.props.hover;
    const hoverSong = this.props.hoverSong;
    const index = this.props.index;
    const song = this.props.song;
    const isSameSong = hoverSong === song;
    const sameSongPlaying = currentSong === song && isPlaying;
    let icon;

    if (hover && isSameSong && !sameSongPlaying) {
      icon = <IconPlay />
    } else if (sameSongPlaying || (currentSong === !null && isPlaying)) {
      icon = <IconPause />
    } else if (currentSong === song && !isPlaying) {
      icon = <IconPlay />
    } else {
      icon = <IconNumber index={index} />
    }

    return (
      <td className="song-number">{icon}</td>
    )
  }
}



class Album extends Component {
   constructor(props) {
     super(props);

     const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug
     });
 
     this.state = {
       album: album,
      currentSong: album.songs[0],
      isPlaying: false
     };

 
     this.audioElement = document.createElement('audio');
     this.audioElement.src = album.songs[0].audioSrc;
 
  }
 
    play() {
     this.audioElement.play();
     this.setState({ isPlaying: true });
   }
    pause() {
     this.audioElement.pause();
     this.setState({ isPlaying: false });
   }   
  
    setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }
 
    handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
       if (!isSameSong) { this.setSong(song); }     
       this.play();
     }
 }
 handlePrevClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play(); 
   }

   render() {
     return (
       <section className="album">
          <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>

           <div className="album-details">
           <h1 id="album-title">{this.state.album.title}</h1>
           <h2 className="artist">{this.state.album.artist}</h2>
           <div id="release-info">{this.state.album.releaseInfo}</div>
           </div>
         </section>
           <table id="song-list">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>  
           <tbody>
             {
             this.state.album.songs.map( (song, index) =>
             <tr className="song" key={index} onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.onMouseEnter(index)} onMouseLeave={() => this.onMouseLeave(index)}>
                <td> <button id="song-action-btns">{
             (this.state.currentSong.title === song.title) ?
               <span className={this.state.isPlaying ? "ion-pause" : "ion-play"}></span>
                  :
               (this.state.isHovered === index) ?
                <span className="ion-play"></span>
                  :
                 <span className="song-number">{index+1}</span>

                    }</button>
             </td>


                <td className="song-title-row">{song.title}</td>
                <td className="song-duration-row">{this.formatTime(song.duration)}</td>
              </tr>
                )
              }  
           </tbody>
         </table> 
         <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
         />
        </section>
     );
   }
 }

 export default Album;
