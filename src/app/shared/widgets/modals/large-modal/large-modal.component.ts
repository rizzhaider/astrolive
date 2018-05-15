import { Router } from '@angular/router';
import { AuthenticationService } from './../../../services/authentication.service';
import { LogService } from 'ng2-log-service';
import { NgForm } from '@angular/forms';
import { ChatMessage } from './../../../models/chat-message.model';
import { UserPresenceService } from './../../../services/user-presence.service';
import { UserService } from './../../../services/user.service';
import { PresenceStatus } from '../../../enums/presence-status.enum';
import { Component, OnInit, OnChanges, OnDestroy, Input, Output, SimpleChange, ViewChild, ElementRef, EventEmitter } from '@angular/core';
declare var Notification;
@Component({
  selector: 'app-large-modal',
  templateUrl: './large-modal.component.html',
  styleUrls: ['./large-modal.component.css'],
  providers: [LogService]
})
export class LargeModalComponent implements OnInit, OnChanges {
  // Incoming Call Event
  @Input() private callEvent: any;
  // Outgoing Call Event
  @Output() private callOutEvent: EventEmitter<any> = new EventEmitter();
  @Output() private callEndEvent: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('lgModal') _lgModal: any;
  @ViewChild('timer') appTimer: any;
  @ViewChild('incomingModal') _incomingModal: any;
  @ViewChild('localVid') localVideo: ElementRef;
  @ViewChild('remoteVid') remoteVideo: ElementRef;
  @ViewChild('audioRingtone') audioRingtone: ElementRef;
  @ViewChild('chatBox') chatBox: ElementRef;


  private offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };

  private localStream: any;
  private remoteStream: any;
  private peerConnection: any;
  private remoteSdp: any;
  private remoteId: string;
  public remoteName: string;
  private remoteDeviceId: string;
  private initiator: boolean = false;
  private notification: any;

  public chatMessages: ChatMessage[] = [];
  public messageText: string;
  public callStatus: string = 'Disconnected';
  private qvgaConstraints = {
    audio: true,
    video: {width: {exact: 240}, height: {exact: 320}}
  };

  public isMute: boolean;
  public remoteOnMute: boolean;
  public muteButtonText: string = "Mute";
  private scrollToBottomInitially: boolean = true;


  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
  private presenceService: UserPresenceService,
  private logService: LogService) { 
    this.logService.namespace = 'CallComponent';
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
      this.hideIncomingNotification();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = chng.currentValue;

   
      if (propName === 'callEvent') {
        if (cur && (JSON.parse(cur)).event === 'offer') {
       
          let params = (JSON.parse(cur)).params;
          this.remoteSdp = params.sdp;
          let curstatus = this.userService.getPresenceStatus();

          if (params.isRestart) {
            if (this.remoteId === params.fromID) {
                if (curstatus === PresenceStatus.BUSY.toString()) {
                    this.restartCall();
              }
              
            } 
            
          } else {
           


            if (curstatus !== PresenceStatus.ONLINE.toString()) {
              this.logService.info('Rejecting call from ' + this.remoteName + ' because Astro Status is ' + curstatus);  
              this.sendReject('rejectbusy', params.fromID, params.fromDeviceID);
              return;
            }
            
            this.remoteId = params.fromID;
            this.remoteName = params.from;
            this.remoteDeviceId = params.fromDeviceID;

            this.showIncomingNotification();
            // Set Presence Status as Busy
            let userId = this.userService.getUser();
            let status = PresenceStatus.BUSY.toString();

            this.logService.info('Setting Astro Presence as Busy');

            this.presenceService.updatePresence(userId, status).subscribe(
              data => {
                this.logService.debug('Received updatePresence response', data);
              },
              error => {
                this.logService.error(error);
              });
          }

       //this.startCall();

        } else if (cur && (JSON.parse(cur)).event === 'candidate') {
          
          let params = (JSON.parse(cur)).params;
          if (this.remoteId === params.fromID) {
            let candidate = params.candidate;
            let label = params.label;
            let id = params.id;
            var candidateObj = {
              candidate: candidate,
              label: label,
              id: id
            };
  
  
            this.peerConnection.addIceCandidate(candidateObj)
              .then(
              () => {
                this.onAddIceCandidateSuccess(this.peerConnection);
              },
              (err) => {
                this.onAddIceCandidateError(this.peerConnection, err);
              }
              );
          }

        } else if (cur && ((JSON.parse(cur)).event === 'disconnect' || (JSON.parse(cur)).event === 'hangup' || (JSON.parse(cur)).event === 'cancel')) {
            let params = (JSON.parse(cur)).params;
            if (this.remoteId === params.fromID) {
              this.hangup('call finished by remote');
            }

        } else if (cur && ((JSON.parse(cur)).event === 'socketOpened')) {
          // Check Latest Status from Server
         if (this.callStatus != 'Disconnected') {
            this.checkCallStatus();
         }
          

        } else if (cur && ((JSON.parse(cur)).event === 'checkcallstatusresponse')) {
          let params = (JSON.parse(cur)).params;
          if (params.success) {
            this.logService.info('Call Details exists. wait');
          } else {
            this.hangup(params.message);
          }
          

        } else if (cur && ((JSON.parse(cur)).event === 'mute')) {
          let params = (JSON.parse(cur)).params;
          if (this.remoteId === params.fromID) {
            if (params.message === 'unmute') {
              this.remoteOnMute = true;
            } else if (params.message === 'mute') {
              this.remoteOnMute = false;
            }
          }
          

        } else if (cur && (JSON.parse(cur)).event === 'msg') {
            let params = (JSON.parse(cur)).params;
            let message = new ChatMessage();
            message.message = params.message;
            message.from = params.from;
            message.time = Date.now();
        
            if (params.fromID === this.userService.getUser()) {
              message.type = 'outgoing';
            } else {
              message.type = 'incoming';
            }
            
            // Check of scroll to bottom required or not
            let _scrollToBottom: boolean = false;
            
            if (this.chatBox.nativeElement.scrollHeight > this.chatBox.nativeElement.clientHeight) {
                if (this.scrollToBottomInitially) {
                    _scrollToBottom = true;
                    this.scrollToBottomInitially = false;
                } else {
                  if (this.chatBox.nativeElement.scrollTop + this.chatBox.nativeElement.clientHeight === this.chatBox.nativeElement.scrollHeight)
                    _scrollToBottom = true;  
              }
                 
                 
            }
            
            this.chatMessages.push(message);
            
            if (_scrollToBottom) {
                 setTimeout(() => {
                  this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
              }, 100);
            }
          
        }

      }
    }
  }

  answerCall() {
    this.hideIncomingNotification();
    this._lgModal.show();
    this.startCall();
  }

  startCall() {
    this.callStatus = 'Connecting';
    this.isMute = false;
    this.remoteOnMute = false;
    this.muteButtonText = "Mute";
    this.scrollToBottomInitially = true;
    navigator.mediaDevices.getUserMedia(this.qvgaConstraints)
      .then(this.gotStream.bind(this))
      .catch((e) => {
        this._lgModal.hide();
        alert('getUserMedia() error: ' + e.name);
      });
  }

  restartCall() {
    this.logService.info('Inside restart call');
    if (this.remoteSdp) {
      let sdpObject = {
        sdp: this.remoteSdp,
        type: 'offer'
      };

      this.peerConnection.setRemoteDescription(sdpObject).then(
        () => {
          this.onSetRemoteSuccess(this.peerConnection);
        },
        this.onSetSessionDescriptionError
      );
      
     this.peerConnection.createAnswer().then(
        this.onCreateAnswerSuccess.bind(this),
        this.onCreateSessionDescriptionError
      );
    }
  }

  gotStream(stream) {
    this.callStatus = 'Connected';
    this.localVideo.nativeElement.srcObject = stream;
    this.localStream = stream;
    var videoTracks = this.localStream.getVideoTracks();
    var audioTracks = this.localStream.getAudioTracks();
    if (videoTracks.length > 0) {
      this.logService.info('Using video device: ' + videoTracks[0].label);
    }
    if (audioTracks.length > 0) {
      this.logService.info('Using audio device: ' + audioTracks[0].label);
    }

    let iceServers = [{
      urls: ["turn:turn.rockstand.in?transport=udp"],
      username: "turnhandy",
      credential: "realpwd"
    }];

    let config = { 'iceServers': iceServers };

    this.peerConnection = new RTCPeerConnection(config);

    this.logService.info('Created local peer connection object pc');
    this.peerConnection.onicecandidate = (e) => {
      this.onIceCandidate(this.peerConnection, e);
    };

    this.peerConnection.oniceconnectionstatechange = (e) => {
      this.onIceStateChange(this.peerConnection, e);
    };

    this.peerConnection.onaddstream = this.gotRemoteStream.bind(this);


    this.peerConnection.addStream(this.localStream);

    this.logService.info('Added local stream to this.peerConnection');

    if (this.remoteSdp) {
      let sdpObject = {
        sdp: this.remoteSdp,
        type: 'offer'
      };

      this.peerConnection.setRemoteDescription(sdpObject).then(
        () => {
          this.onSetRemoteSuccess(this.peerConnection);
        },
        this.onSetSessionDescriptionError
      );


      this.peerConnection.createAnswer().then(
        this.onCreateAnswerSuccess.bind(this),
        this.onCreateSessionDescriptionError
      );
    } else {
      this.peerConnection.createOffer(
        this.offerOptions
      ).then(
        this.onCreateOfferSuccess.bind(this),
        this.onCreateSessionDescriptionError
        );
    }
  }


  onCreateSessionDescriptionError(error) {
    this.logService.error('Failed to create session description: ' + error.toString());
  }

  onCreateOfferSuccess(desc) {
    this.logService.info('Offer from this.peerConnection', desc.sdp);
    this.peerConnection.setLocalDescription(desc).then(
      () => {
        this.onSetLocalSuccess(this.peerConnection);
      },
      this.onSetSessionDescriptionError
    );
  }

  onSetLocalSuccess(pc) {
    this.logService.info('setLocalDescription complete');
    if (this.initiator) {

    } else {
      this.sendAnswerSdp(pc.localDescription);
    }
  }

  onSetRemoteSuccess(pc) {
    this.logService.info('setRemoteDescription complete');
  }

  onSetSessionDescriptionError(error) {
    this.logService.error('Failed to set session description: ', error.toString());
  }

  gotRemoteStream(e) {
    this.remoteStream = e.stream;
    this.remoteVideo.nativeElement.srcObject = e.stream;
    this.logService.info('this.peerConnection received remote stream');
    this.appTimer.startCallTimer();
  }

  onCreateAnswerSuccess(desc) {
    this.peerConnection.setLocalDescription(desc).then(
      () => {
        this.onSetLocalSuccess(this.peerConnection);
      },
      this.onSetSessionDescriptionError
    );
  }

  onIceCandidate(pc, event) {
    if (event.candidate) {
      this.sendLocalCandidate(event.candidate);
    }

    this.logService.debug(' ICE candidate: \n' + (event.candidate ?
      event.candidate.candidate : '(null)'));
  }

  onAddIceCandidateSuccess(pc) {
    this.logService.debug('addIceCandidate success');
  }

  onAddIceCandidateError(pc, error) {
    this.logService.error('failed to add ICE Candidate: ', error.toString());
  }

  onIceStateChange(pc, event) {
    if (pc) {
      this.logService.debug('ICE state: ' + pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected') {
        this.callStatus = 'Connected';
      } else if (pc.iceConnectionState === 'disconnected') {
        this.callStatus = 'Reconnecting';
      }
    }
  }

  endCall() {
    this.sendDisconnect();
    this.hangup('Disconnected by Self');
  }


  endReject() {
    this.hangup('Call Rejected');
    this.sendReject('reject', this.remoteId, this.remoteDeviceId);
  }

  hangup(reason) {
    this.logService.info('Ending call ', reason);

    //clear chat messages
    this.chatMessages = [];
    this.callStatus = 'Disconnected';
    if (this.peerConnection != null) {
      this.peerConnection.close();
      this.peerConnection = null;
    }


    if (this.localStream) {
      if (typeof this.localStream.getTracks === 'undefined') {
        this.localStream.stop();
      } else {
        this.localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      this.localStream = null;
    }
    this.appTimer.endCallTimer();
    this.hideIncomingNotification();
    this._lgModal.hide();
    this.callEndEvent.emit();
  
    let userId = this.userService.getUser();
    let status = PresenceStatus.ONLINE.toString();

    this.logService.info('Setting Astro Presence as Online');

    this.presenceService.updatePresence(userId, status).subscribe(
      data => {
        this.logService.info('Received updatePresence status', data);
        if (data.callTrack) {
          // Instruction from server to log out this user
          this.authenticationService.logout(null, null); // null as date and time are not known in forceful logout
          this.router.navigate(['login']);
        }
      },
      error => {
        this.logService.error(error);
      });

      

  }

  showIncomingNotification() {
    this._incomingModal.show();
    this.audioRingtone.nativeElement.play();

    if (Notification && Notification.permission !== "denied") {
      let that = this;
      Notification.requestPermission(function (status) {  // status is "granted", if accepted by user
        that.notification = new Notification('Incoming Call', {
         // body: 'Incoming Call from ' + that.remoteName,
         body: 'Incoming Call',
          icon: 'assets/images/astrolive_square.png' // optional
        });

        that.notification.onclick = function(x) { window.focus(); };

      });
    }

    this.sendRing();

  }

  hideIncomingNotification() {
    this._incomingModal.hide();
    this.audioRingtone.nativeElement.pause();
    if (this.notification) {
      this.notification.close();
    }
    
  }

  toggleMute() {
    if (!this.isMute) {
        this.muteCall();
    } else {
      this.unmuteCall();
    }
  }

  muteCall () {
			if (this.localStream) {
				var audioTracks = this.localStream.getAudioTracks();
				for (var i = 0; i < audioTracks.length; i++) {
		    	  audioTracks[i].enabled = false;
				}
				
				this.isMute = true;
        this.muteButtonText = "Unmute";

        this.sendMuteMessage('unmute');
	  		}
 		};
		
		unmuteCall() {
			if (this.localStream) {
				var audioTracks = this.localStream.getAudioTracks();
				for (var i = 0; i < audioTracks.length; i++) {
		    	  audioTracks[i].enabled = true;
				}
				this.isMute = false;
        this.muteButtonText = "Mute";

        this.sendMuteMessage('mute');
			}
 		};

  sendAnswerSdp(sdp) {
    var paramsObj = {
      destination: this.remoteId,
      from: this.userService.getUserDetails().name,
      toID: this.remoteId,
      fromID: this.userService.getUser(),
      toDeviceID: this.remoteDeviceId,
      sdp: sdp.sdp
    };
    var jsonMsg = {
      type: "call",
      event: "answer",
      params: paramsObj
    };

    this.callOutEvent.emit(jsonMsg);
  };

  sendLocalCandidate(candidate) {
    var paramsObj = {
      destination: this.remoteId,
      from: this.userService.getUserDetails().name,
      toID: this.remoteId,
      fromID: this.userService.getUser(),
      toDeviceID: this.remoteDeviceId,
      label: candidate.sdpMLineIndex,
      candidate: candidate.candidate,
      id: candidate.sdpMid
    };
    var jsonMsg = {
      type: "call",
      event: "candidate",
      params: paramsObj
    };

    this.callOutEvent.emit(jsonMsg);
  };

  sendDisconnect() {
    var paramsObj = {
      destination: this.remoteId,
      from: this.userService.getUserDetails().name,
      toID: this.remoteId,
      fromID: this.userService.getUser(),
      toDeviceID: this.remoteDeviceId,
    };
    var jsonMsg = {
      type: "call",
      event: "disconnect",
      params: paramsObj
    };
    this.callOutEvent.emit(jsonMsg);

  };

  sendReject(event: string, remoteID: string, remoteDeviceID: string) {
    var paramsObj = {
      destination: this.remoteId,
      from: this.userService.getUserDetails().name,
      toID: remoteID,
      fromID: this.userService.getUser(),
      toDeviceID: remoteDeviceID,
    };
    var jsonMsg = {
      type: "call",
      event: event,
      params: paramsObj
    };

    this.callOutEvent.emit(jsonMsg);
  };

  sendRing() {
    var paramsObj = {
      destination: this.remoteId,
      from: this.userService.getUserDetails().name,
      toID: this.remoteId,
      fromID: this.userService.getUser(),
      toDeviceID: this.remoteDeviceId,
    };
    var jsonMsg = {
      type: "call",
      event: "ring",
      params: paramsObj
    };

    this.callOutEvent.emit(jsonMsg);
  };


  sendChatMessage() {
    if (this.messageText.trim().length > 0) {
      var paramsObj = {
        destination: this.remoteId,
        from: this.userService.getUserDetails().name,
        toID: this.remoteId,
        fromID: this.userService.getUser(),
        toDeviceID: this.remoteDeviceId,
        message: this.messageText
      }

      var jsonMsg = {
        type: "chat",
        event: "msg",
        params: paramsObj
      };
      this.callOutEvent.emit(jsonMsg);
    }

    this.messageText = '';

  }

  
  sendMuteMessage(_message: string) {

    var paramsObj = {
      destination: this.remoteId,
      from: this.userService.getUserDetails().name,
      toID: this.remoteId,
      fromID: this.userService.getUser(),
      toDeviceID: this.remoteDeviceId,
      message: _message
    }

    var jsonMsg = {
      type: "call",
      event: "mute",
      params: paramsObj
    };
    this.callOutEvent.emit(jsonMsg);
  }

  
  checkCallStatus() {
      var paramsObj = {
        destination: this.remoteId,
        from: this.userService.getUserDetails().name,
        toID: this.remoteId,
        fromID: this.userService.getUser(),
        toDeviceID: this.remoteDeviceId,
        message: this.messageText
      }

      var jsonMsg = {
        type: "call",
        event: "checkcallstatus",
        params: paramsObj
      };
      this.callOutEvent.emit(jsonMsg);
    
    }

   


}
