const IntroJson = {
	Items:[
		{'Console' : '???','Text':'The computer has chosen a random number between 100 and 1000.', 'HTML':''},
		{'Console' : '123','Text':'You need to guess what it is.','HTML':''},
		{'Console' : 'BTF','Text':'The computer will give you a code with some clues. ','HTML':''},
		{'Console' : 'BTF','Text':'The code B means the digit is not in the number.', 'HTML':'<span class="emphasis">B</span>TF'},
		{'Console' : 'BTF','Text':'The code T means the digit is in the number, but in the wrong place.','HTML':'B<span class="emphasis">T</span>F'},
		{'Console' : 'BTF','Text':'F Means the digit is in the right place.','HTML':'BT<span class="emphasis">F</span>'},
		{'Console' : '283','Text':'Your goal is to get FFF as many times as you can in 2 minutes.','HTML':''},
		{'Console' : 'FFF','Text':'Are you ready to accept the challenge?','HTML':'<span class="emphasis">FFF</span>'}



	]

}

const CountdownObj = {

Items:[
	{'Console':'Setting up RandomNumbers...', 'Action': () => { 
		
		window.InitInput = window.setInterval( (event)=>{

			DalyasGame.SetRandomNumber();
			document.querySelector("#gameText").value = DalyasGame.OurRandomNumber;

		},40);
	}},
	{'Console':'Allocating game time...', 'Action': () => { 
		
		

			let currentNumElem = document.querySelector("#timer");
			currentNumElem.innerHTML='00:00';
	}},

	{
		'Console':'Finalizing Game...','Action':()=>{

			window.clearInterval(window.InitInput);
			document.querySelector("#gameText").value = '';
		}
	}



]

}

const DalyasGame = {
			HighScores: { beginner: [], advanced: [] },
			PlayerName: 'unknown',
			OurRandomNumber: 0,// 
			ListOfChances: [],
			NumberOfRounds: 0,
			DialogElem: {},
			IntroIndex:0,
			Level: 'beginner',
			GameState: 'intro',
			CurrentTime: 0,
			CountdownNumber: 0,
			LengthOfGameInMinutes: 2,
			EndOfGame: {},

			Init: function () {

				if (window.IntroText){
				window.clearInterval(window.IntroText);
				}
				document.querySelector("#gameSection").style.display ="block";
				document.querySelector("#ruleSection").style.display="none";
				DalyasGame.SetRandomNumber();
				DalyasGame.ListOfChances = [];
				DalyasGame.NumberOfRounds = 0;
				DalyasGame.GetScores();
				DalyasGame.BeginAdvancedRound();
				document.querySelector("#gameText").focus();
				//DalyasGame.DisplayScores();
				//DalyasGame.ShowModal("Select a name and level to begin");



			},

			ShowIntro:function(){

				DalyasGame.HighScores.advanced.push({ Name: 'TYP', Score: 5 });
				DalyasGame.HighScores.advanced.push({ Name: 'YYP', Score: 6 });

				window.IntroText = window.setInterval(e =>{

					const currentItem = IntroJson.Items[DalyasGame.IntroIndex];
					const consoleText = DalyasGame.RenderConsoleText(currentItem);
				
					
					DalyasGame.IntroIndex = DalyasGame.IntroIndex >= IntroJson.Items.length-1 ?0 : DalyasGame.IntroIndex+1;

				}, 1800)


			},

			RenderConsoleText(obj){

				const $currentElem = document.querySelector("#terminal");
				document.querySelector("#rules").innerHTML = obj.Text;

					
				obj.Console.split('').forEach((item,index,arr)=>{

				(function(index){window.setTimeout((e)=>{

					if (index=== arr.length - 1 && obj.HTML!==''){
						$currentElem.innerHTML = obj.HTML;

					}
					else{
						const currentText = obj.Console.substring(0,index+1);
						$currentElem.innerHTML = currentText;
					}
					

				},100 * index);
			})(index);
			});

		},

			ShowModal: function (msg) {



				document.querySelector("#dialog-message").innerHTML = msg;
				DalyasGame.DialogElem.showModal();


			},

			StartNextRound: function () {

				DalyasGame.SetRandomNumber();
				DalyasGame.ListOfChances = [];
				DalyasGame.NumberOfRounds++;
				document.querySelector("#round").innerHTML = DalyasGame.NumberOfRounds;
				;


			},

			SetRandomNumber: function () {

				DalyasGame.OurRandomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;

			},

			WriteToConsole: function(text, elemClass, target){
				if(target===undefined){
					target = "#consoleText";
				}

				let id = `comment--${new Date().getUTCDate().toString()}`;
				let textElem = document.createElement("div");
				textElem.id=id;
				//textElem.innerHTML = text;
				textElem.className=elemClass;
				const parentElem = document.querySelector(target);

				document.querySelector(target).insertBefore(textElem,parentElem.firstChild);

				var $currentElem = document.querySelector("#"+ id);

				text.split('').forEach((item,index)=>{

					(function(index){window.setTimeout((e)=>{

						const currentText = text.substring(0,index+1);
						$currentElem.innerHTML = currentText;
						

					},10 * index);
				})(index);

				});


			},

			GetScores: function () {

				const highScores = localStorage.getItem('highScores');

				if (highScores) {
					DalyasGame.HighScores = JSON.parse(highScores);
				}

			},

			BeginAdvancedRound: function () {

				DalyasGame.CountdownNumber = 0;
				document.querySelector("#gameText").setAttribute("disabled", true);
				window.Countdown = setInterval(() => {


					if (DalyasGame.CountdownNumber <3) {
						const currentCountObj = CountdownObj.Items[DalyasGame.CountdownNumber];
						DalyasGame.WriteToConsole(currentCountObj.Console,"");
						currentCountObj.Action();
						DalyasGame.CountdownNumber++;

					}
					else {
						//DalyasGame.CountdownNumber = 5;
						clearInterval(window.Countdown);
						document.querySelector("#timer").innerHTML = "GO!";
						DalyasGame.BeginAdvancedGame();

					}

				}, 1000)

			},

			BeginAdvancedGame: function () {
				DalyasGame.GameState = 'game_play';

				document.querySelector("#gameText").removeAttribute("disabled");

				DalyasGame.EndOfGame = new Date().getTime() + DalyasGame.LengthOfGameInMinutes * 60000;
				document.querySelector("#gameText").focus();
				document.querySelector("#inputInner").className="has-cursor";

				window.GamePlay = setInterval(() => {

					const now = new Date().getTime();
					const t = DalyasGame.EndOfGame - now;


					if (t <= 0) {

						window.clearInterval(window.GamePlay);
						DalyasGame.SetScores(DalyasGame.NumberOfRounds);
						//DalyasGame.Init();
						DalyasGame.GameState ='game_over';
						DalyasGame.WriteToConsole(`Game Over! You have ${DalyasGame.NumberOfRounds} points!`,"");
						DalyasGame.WriteToConsole("If you would like to play again, type YES into the input box.");
					
						//DalyasGame.ShowModal(`Game Over! You got ${DalyasGame.NumberOfRounds}. <br/> Want to play again ?` );
					}
					else {

						DalyasGame.SetCountdownClock(t);

					}

				}, 1000);


			},

			AddSecondsToTime:function(timeAddedInSeconds){

				for(let i=0;i<=timeAddedInSeconds;i++){

					(function(i){
					window.setTimeout((e)=>{
						DalyasGame.EndOfGame+= 1000;
						const t = DalyasGame.EndOfGame - new Date().getTime();;
						DalyasGame.SetCountdownClock(t);

					},10*i);

					})(i);

				}

			},

			SetCountdownClock: function(t){
				let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
						let seconds = (Math.floor((t % (1000 * 60)) / 1000)).toString();

						seconds = parseInt(seconds) < 10 ? '0' + seconds : seconds;


						document.querySelector("#timer").innerHTML = `${minutes}:${seconds}`;

			},

			SetScores: function (points) {

				DalyasGame.HighScores[DalyasGame.Level].push({ Name: DalyasGame.PlayerName, Score: points });

				DalyasGame.HighScores[DalyasGame.Level] = DalyasGame.HighScores[DalyasGame.Level]
					.filter(e => e.Score > 0)
					.sort((a, b) => b.Score - a.Score)
					.splice(0, 3);

				localStorage.setItem('highScores', JSON.stringify(DalyasGame.HighScores));

				//DalyasGame.DisplayScores();
			},

			DisplayInputResults:function($gameTextElem, text,className){
				
				window.setTimeout(e=>{
					$gameTextElem.value = "";
					document.querySelector("#inputInner").className="has-cursor";
					$gameTextElem.focus();
					DalyasGame.WriteToConsole(text,className);
					},500);


			},

			DisplayScores: function () {
				if (window.IntroText){
					window.clearInterval(window.IntroText);
					}

				let advancedText = '';
				document.querySelector("#terminal").innerHTML='';
			
				DalyasGame.HighScores.advanced.forEach((item) => {

					advancedText += `${item.Name} - ${item.Score}<br/>`;

					DalyasGame.WriteToConsole(advancedText,"high-score-item","#terminal");

				});


			},

			MakeSelection: function () {

				let $gameTextElem = document.querySelector("#gameText");

				const regex = /^\d{3}$/;
				let gameText = $gameTextElem.value;
				if (!regex.test(gameText)) {
					DalyasGame.WriteToConsole("Invalid entry - 5 second penalty!","error");
					DalyasGame.AddSecondsToTime(-5);
					$gameTextElem.value ="";
					document.querySelector("#inputInner").className="has-cursor";
					$gameTextElem.focus();
				
				}
				else {

					//take the number that the we made and split it into 3 piecies
					//take the number computer made and split that into 3 pieces
					//then compare the computer number against our number

					let whatIsHappening = 'The computer has number' + DalyasGame.OurRandomNumber + ' and we have chosen ' + gameText;

					let ourGameText = gameText.split('');

					let resultsCode = '';

					let computerGameText = DalyasGame.OurRandomNumber.toString().split('');

					$gameTextElem.value = '';

					if (DalyasGame.OurRandomNumber.toString() === gameText) {

							DalyasGame.DisplayInputResults($gameTextElem, "Congrats! Code successfully unlocked. Resetting to new number","victory");
							
							
							
							if(DalyasGame.ListOfChances.length<4){

								DalyasGame.DisplayInputResults($gameTextElem, "30 second bonus for guessing in under 4 tries","bonus");
								DalyasGame.AddSecondsToTime(30);
							}
							else if(DalyasGame.ListOfChances.length>3 && DalyasGame.ListOfChances.length< 7){

								DalyasGame.DisplayInputResults($gameTextElem, "15 second bonus for guessing in under 7 tries","bonus");
								DalyasGame.AddSecondsToTime(15);

							}
							DalyasGame.StartNextRound();
							return;

					}

					for (let i = 0; i < 3; i++) {
						//check our number against the computers number
						if (ourGameText[i] === computerGameText[i]) {
							whatIsHappening += `<br/>Number ${i + 1} was right!.  The computer chose ${computerGameText[i]} and you chose ${ourGameText[i]}<br/>`;
							resultsCode += 'F';

						}
						else if ((ourGameText[i] !== computerGameText[i]) && DalyasGame.OurRandomNumber.toString().indexOf(ourGameText[i]) !== -1) {
							whatIsHappening += `<br/>Number ${i + 1} not totally right - it is there, but not in the same place!.  The computer chose ${computerGameText[i]} and you chose ${ourGameText[i]}<br/>`;
							resultsCode += 'T';
						}
						else {
							whatIsHappening += `<br/>Number ${i + 1} was wrong!.  The computer chose ${computerGameText[i]} and you chose ${ourGameText[i]}<br/>`;

							resultsCode += 'B';

						}

					}

					resultsCode = `${resultsCode} (${gameText})`;

					DalyasGame.ListOfChances.push(resultsCode);

					$gameTextElem.value=resultsCode
					//$resultsElem.innerHTML = DalyasGame.ListOfChances.join('<br/>');
					console.log(whatIsHappening);
					
					DalyasGame.DisplayInputResults($gameTextElem,`Code ${resultsCode} for number ${gameText} (attempt ${DalyasGame.ListOfChances.length})`,"results");


				}

			}

		}