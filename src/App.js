import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';
import {Router, Route, Link, Switch, Redirect} from "react-router-dom";
import {createStore, combineReducers, bindActionCreators} from 'redux';
import createHistory from "history/createBrowserHistory";
import logo2 from './img/logo.png';
import print from './img/print.png';
import gas from './img/gas.jpg';
import water from './img/water.jpg';
import electric from './img/electric.jpg';
import './css/App.css';
import './css/bootstrap.css';
import './css/font-awesome.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/js/bootstrap.js';

let initialState = [
    {
        id: 0,
        userName: "Alexey Silifonov",
        counterData: [{electric: 10, heating: 10, gas: 10, rent: 60, water: 10}],
        tarifs: [{electric: 2, heating: 2, gas: 2, rent: 2, water: 2}],
        payment: [{date: 1426833222157, ticket: "", summaryMoney: 1950}]
    },
    {
        id: 1,
        userName: "Petr Silifonov",
        counterData: [{electric: 10, heating: 10, gas: 10, rent: 60, water: 10}],
        tarifs: [{electric: 1, heating: 1, gas: 1, rent: 1, water: 1}],
        payment: [{date: 1426833222157, ticket: "", summaryMoney: 2250}]
    },
    {
        id: 2,
        userName: "Petr Vasylenko",
        counterData: [{electric: 2, heating: 2, gas: 1, rent: 55, water: 1}],
        tarifs: [{electric: 0.9, heating: 3, gas: 6.95, rent: 2, water: 7.5}],
        payment: [{date: 1426833222167, ticket: "", summaryMoney: 500}]
    },
    {
        id: 3,
        userName: "Vasya Petrov",
        counterData: [{electric: 20, heating: 10, gas: 10, rent: 90, water: 10}],
        tarifs: [{electric: 0.9, heating: 3, gas: 6.95, rent: 3, water: 7.5}],
        payment: [{date: 1426833222167, ticket: "", summaryMoney: 1950}]
    }
];


function userDataReducer(state = initialState, action) {
    console.log("State=", state);
    switch (action.type) {

        case 'SET_USER_COUNTERS':
            let newArr = [...state];
            let tarifsData = state[action.id].tarifs[0];
// eslint-disable-next-line
            let myArr = newArr.splice(action.id, 1, {
                id: action.id,
                userName: state[action.id].userName,
                counterData: [{
                    electric: action.counterData[0].electric,
                    heating: action.counterData[0].heating,
                    gas: action.counterData[0].gas,
                    rent: action.counterData[0].rent,
                    water: action.counterData[0].water
                }],
                tarifs: [{
                    electric: tarifsData.electric,
                    heating: tarifsData.heating,
                    gas: tarifsData.gas,
                    rent: tarifsData.rent,
                    water: tarifsData.water
                }],
                payment: [{
                    date: action.payment[0].date,
                    ticket: action.payment[0].ticket,
                    summaryMoney: action.payment[0].summaryMoney
                }]
            });
            return newArr;

        case 'CHANGE_TARIF':
            let newArrChange = [...state];
            let counterData2 = state[action.id].counterData[0];
            let paymentData2 = state[action.id].payment[0];
            console.log('nerArr', newArrChange);
            newArrChange.splice(action.id, 1, { // перезаписыввеем знаения текущего ID
                id: action.id,
                userName: state[action.id].userName,
                counterData: [{
                    electric: counterData2.electric,
                    heating: counterData2.heating,
                    gas: counterData2.gas,
                    rent: counterData2.rent,
                    water: counterData2.water
                }],
                tarifs: [{
                    electric: action.tarifs[0].electric,
                    heating: action.tarifs[0].heating,
                    gas: action.tarifs[0].gas,
                    rent: action.tarifs[0].rent,
                    water: action.tarifs[0].water
                }],
                payment: [{
                    date: paymentData2.date,
                    ticket: paymentData2.ticket,
                    summaryMoney: paymentData2.summaryMoney
                }]
            })
            console.log('nerArr', newArrChange);
            return newArrChange

        case 'DELETE_USER':
            let newArr2 = state;
            let deleteUserId = action.id;
            let delIndex = newArr2.findIndex(i => i.id === deleteUserId);
            console.log('ARR BEFORE Delete', newArr2);
            if (delIndex === deleteUserId) {
                newArr2.splice(delIndex, 1);
                return newArr2;
            }
            return state

        default:
            return state
    }
};

//selected user
function userActiveReducer(user) {
    return {
        type: "SELECT_USER",
        user: user
    }
};

const allReducers = combineReducers({
    users: userDataReducer,
    activeUser: userActiveReducer
})

function matchDispatchToProps(dispatch) {
    return bindActionCreators({userActiveReducer: userActiveReducer}, dispatch)
}

const store = createStore(allReducers);

// store.subscribe( () =>
//   console.log(store.getState())
// );
// store.dispatch({
//    type: 'SET_USER_COUNTERS',
//    id: 3,
//    userName: "zzz",
//    counterData: [{electric: 1, heating: '0', gas: '0', rent: '0', water: '0'}]
//   }
// );
// store.dispatch({ type: 'CHANGE_TARIF' });
// store.subscribe( () =>
//   console.log(store.getState())
// );


//========================NAV MEnu============================

class NavMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0, searchUser: '', currentUser: this.props.users, userInfo: this.props.users[0],
            modalWindowShowClass: "modal fade", modalWindowShowStyle: "none", valueSearch: "", showTarifClass: "none",
            currentTime: new Date(),
            time: 1195000
        };
        this.id = {};
        this.selectUser = this.selectUser.bind(this);
        //this.deleteUser = this.deleteUser.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSubmitSearch = this.onSubmitSearch.bind(this);
        this.onCloseModalSearch = this.onCloseModalSearch.bind(this);
        this.stop = this.stop.bind(this);
        this.start = this.start.bind(this);

        // this.createInfo = this.createInfo.bind(this);
    }

    onSearchChange(event) {
        event.preventDefault();
        let arr = this.props.users;
        let newCurrentDisplayed = arr.filter(person => person.userName.toLowerCase().includes(event.target.value.toLowerCase()));
        this.setState({
            valueSearch: event.target.value,
            currentUser: newCurrentDisplayed
        })

    }

    onSubmitSearch(event) {
        event.preventDefault();
        this.setState({
            modalWindowShowClass: "modal fade show",
            modalWindowShowStyle: "block"
        })
    }

    onCloseModalSearch(event) {
        this.setState({
            modalWindowShowClass: "modal fade",
            modalWindowShowStyle: "none",
            showTarifClass: "none"
        });
    }

    // createInfo() {
    // return this.props.users[this.state.id].counterData.map( (user, index, array) => {
    //   console.log(user);
    //   return (
    //     <div key={index}>
    //     <h5>Показания счетчиков</h5>
    //     <p>Электричество: {user.electric} (кВт)</p>
    //     <p>Тепло: {user.heating} (Гкал)</p>
    //     <p>Газ: {user.gas} (м3)</p>
    //     <p>Квартплата: {user.rent} (м2)</p>
    //     <p>Вода: {user.water} (м3)</p>
    // </div>
    //   );
    // }) ;
    // }

    selectUser(event) {
        var item = event.target.attributes.getNamedItem("data-key").value;
        this.setState({
            id: +item,
            userInfo: this.props.users[item],
            showTarifClass: "block"
        })
    }

    /* deleteUser(event) {
      var item = event.target.attributes.getNamedItem("data-key").value;
      this.setState({
        id: item-1,
        userInfo: this.props.users[item-1]
      });
      store.dispatch({
         type: 'DELETE_USER',
         id: +item
       });

    } */

    createUsersList() {
        return this.state.currentUser.map((user) => {
            return (
                <li
                    data-key={user.id}
                    key={user.id}
                    onClick={this.selectUser}
                >{user.counterData.electric} {user.userName}
                    <button data-key={user.id} onClick={this.selectUser} className="btn btn-info infouser" type="button"
                            data-toggle="collapse" data-target="#collapseUserInfo"><i data-key={user.id}
                                                                                      onClick={this.selectUser}
                                                                                      className="fa fa-info"></i>
                    </button>
                    {/* <button  data-key={user.id} onClick={ this.deleteUser } className="btn btn-danger"> <i data-key={user.id} onClick={ this.deleteUser } className="fa fa-window-close"></i></button> */}
                </li>
            );
        });
    }

    start() {
        this.timerId = setInterval(() => this.tick(), 1000);
    }

    stop() {
        clearInterval(this.timerId);
    }

    tick() {
        this.setState({time: this.state.time + 1000});
    }

    componentDidMount() {
// this.timerId = setInterval (
// () => this.tick(),
// 1000
// );
    }

    componentWillUnmount() {
// clearInterval(this.timerId);
    }


    render() {

        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href=""><img className="logo-img" src={logo2} alt="home"/></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link to="/" className="nav-link"><span className="sr-only">(current)</span>Домой</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/pay" className="nav-link">Отправить показания</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className="nav-link">О сервисе</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/settings" className="nav-link">Сменить тариф</Link>
                            </li>

                            <button onClick={this.start}> Start</button>
                            <p> {new Date(this.state.time).getMinutes()} : {new Date(this.state.time).getSeconds()} </p>
                            <button onClick={this.stop}> Stop</button>
                        </ul>
                        <form className="form-inline my-2 my-lg-0" onSubmit={this.onSubmitSearch}>
                            <span className="time"> {this.state.currentTime.toLocaleTimeString()} </span>
                            <input className="form-control mr-sm-2" type="search" onChange={this.onSearchChange}
                                   placeholder="Поиск..." value={this.state.valueSearch} aria-label="Search"/>
                            <button className="btn btn-outline-success my-2 my-sm-0" type="button" data-toggle="modal"
                                    data-target="#myModalSearch">Найти
                            </button>
                        </form>

                    </div>
                </nav>


                <div style={{display: this.state.modalWindowShowStyle}} className={this.state.modalWindowShowClass}
                     id="myModalSearch" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="myModalLabel">Результаты поиска:</h5>
                                <button type="button" className="close" data-dismiss="modal"
                                        onClick={this.onCloseModalSearch} aria-label="Close"><span
                                    aria-hidden="true">&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <div className="searchList">
                                    <ol>{this.createUsersList()} </ol>
                                </div>
                                <div className="searchInfoUser" style={{display: this.state.showTarifClass}}>

                                    <h5>Тарифы</h5>
                                    <p>Электричество: {this.state.userInfo.tarifs[0].electric} (грн/кВт)</p>
                                    <p>Тепло: {this.state.userInfo.tarifs[0].heating} (грн/Гкал)</p>
                                    <p>Газ: {this.state.userInfo.tarifs[0].gas} (грн/м3)</p>
                                    <p>Вода: {this.state.userInfo.tarifs[0].water} (грн/м3)</p>
                                    <p>Квартплата: {this.state.userInfo.tarifs[0].rent} (грн/м2)</p>

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" onClick={this.onCloseModalSearch}
                                        data-dismiss="modal">Закрыть
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        users: state.users,
        activeUser: state.userActiveReducer
    };
}
NavMenu = connect(mapStateToProps, matchDispatchToProps)(NavMenu);


class Main extends Component {
    render() {
        return (
            <div>
                <h1 className="main-h1"> Сервис для передачи показаний приборов учета жилищно-коммунальных услуг </h1>
            </div>
        );
    }
}

class About extends Component {
    render() {
        return (
            <div>
                <article>
                    <h2>Что будет если не передать показания счетчика воды вовремя?</h2>
                    <p className="text-underline">Согласно действующем законодательству, в случае если вы не передали
                        показания счетчика воды, то плату за эту коммунальную услугу вам должны начислить исходя из
                        среднемесячного потребления (рассчитывается исходя из данных за последние полгода).
                        Действовать такой порядок может на срок до шести месяцев. Затем потребитель, не подающий
                        показания прибора учета воды, переводится на оплату по нормативу.
                        Эти нормы прописаны в п.59 и п. 60 «Правил предоставления коммунальных услуг собственникам и
                        пользователям помещений в многоквартирных домах»</p>

                    <h2>Почему показания счетчика воды необходимо передавать непременно в какой-то жестко ограниченный
                        период времени?</h2>
                    <p className="text-underline">СЭто один из часто задаваемых вопросов – почему показания надо
                        передать именно, скажем, с 20 по 25 число?
                        Жесткой нормы с требованием передать показаний счетчика в какой-то конкретный срок действующее
                        законодательство не содержит. В «Правилах предоставления коммунальных услуг» говорится лишь, что
                        сроки передачи показаний счетчика должны определяться в договоре предоставления услуг.
                        На практике коммунальщики вводят эти требования, поскольку сбор показаний с квартирных счетчиков
                        необходимо синхронизировать с передачей данных по общедомовому прибору учета.
                        Тут надо понимать логику расчета платы за воду: жильцам выставляются платежки и за квартирное
                        потребление, и за общедомовое. Общедомовое в данном случае – это разница между суммой показаний
                        всех индивидуальных счетчиков и показаниями общедомового прибора учета.
                        Если показания квартирных счетчиков собраны не все и не одновременно, то объемы воды, которая
                        зачислятся в общедомовые расходы увеличивается. А дальше они «раскидываются» на все квартиры,
                        пропорционально их площади.</p>

                    <h2>Что будет, если показания счетчика воды переданы неправильно?</h2>
                    <p className="text-underline">В разных городах и организациях на этот счет действуют различные
                        правила. Но общий подход такой, что неправильные показания могут быть скорректированы.
                        Ничего «страшного» не произойдет и в том случае, если вы увидите, что неправильно переданные
                        показания уже отражены в квитанции. Если ошибка незначительная, и укладывается в объемы вашего
                        ежемесячного потребления, то проще всего оплатить сумму, посчитанную исходя из этих неправильных
                        показаний. И уже в следующий раз передать правильные. Получится, что вы просто заплатили немного
                        вперед.
                        Но если ошибочно переданные показания сильно значительно превышают ваше ежемесячное потребления
                        (скажем, на порядок), то нужно обращаться в организацию, которая начисляет плату за воду.
                        Просить их произвести перерасчет. Они обязаны это сделать.</p>
                </article>
                <ol>
                    <li><img src={electric} className="imgAbout" alt="how reading"/></li>
                    <li><img src={gas} className="imgAbout" alt="how reading"/></li>
                    <li><img src={water} className="imgAbout" alt="how reading"/></li>
                </ol>
            </div>
        );
    }
}


class Footer extends Component {
    render() {
        return (
            <div>
                <div className="footer-social">
                    <a href="#1"><i className="fa fa-twitter"></i></a>
                    <a href="#2"><i className="fa fa-vk"></i></a>
                    <a href="#3"><i className="fa fa-google-plus"></i></a>
                    <a href="#4"><i className="fa fa-facebook"></i></a>
                    <a href="#5"><i className="fa fa-youtube"></i></a>
                </div>
            </div>
        );
    }
}

class AddPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0, electric: "", heating: "", gas: "", rent: "", water: "", message: "",
            date: new Date().getTime(),
            ticket: "", ePayment: 0, hPayment: 0, gPayment: 0, rPayment: 0, wPayment: 0, summaryMoney: 0,
            validE: false, validH: false, validG: false, validR: false, validW: false, showTicket: "ticketNone"
        };
        this.onChange = this.onChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.send = this.send.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.selectOption = this.selectOption.bind(this);
        this.calculatePayment = this.calculatePayment.bind(this);
        this.printTicket = this.printTicket.bind(this);
    }

//------------------Write Data to STORE
    send(event) {
        event.preventDefault();
        let storeDate = new Date(this.props.users[this.state.id].payment[0].date).getFullYear() + "-" + new Date(this.props.users[this.state.id].payment[0].date).getMonth();
        let stateDate = new Date(this.state.date).getFullYear() + "-" + new Date(this.state.date).getMonth();
        if (this.state.electric < this.props.users[this.state.id].counterData[0].electric ||
            this.state.heating < this.props.users[this.state.id].counterData[0].heating ||
            this.state.gas < this.props.users[this.state.id].counterData[0].gas ||
            this.state.water < this.props.users[this.state.id].counterData[0].water) {  //если текущие введеные показания меньше старых
            this.setState({message: "Введите достоверные показания! "});
        }
        else if (stateDate === storeDate) { //если показания отправлялись в текущем месяце
            this.setState({message: "Вы уже отправляли показания в этом месяце! "});
        }

        else {
            store.dispatch({
                    type: 'SET_USER_COUNTERS',
                    id: this.state.id,
                    counterData: [{
                        electric: +this.state.electric,
                        heating: +this.state.heating,
                        gas: +this.state.gas,
                        rent: +this.state.rent,
                        water: +this.state.water
                    }],
                    payment: [{date: +this.state.date, ticket: this.state.ticket, summaryMoney: +this.state.summaryMoney}]
                }
            );
            this.calculatePayment();
            this.setState({
                message: "Показания успешно приняты!",
                showTicket: "ticket",
                electric: "",
                heating: "",
                gas: "",
                rent: "",
                water: ""
            });
        }
        store.subscribe(() =>
            console.log(store.getState())
        );
    };

//------------------Write Data to STATE
    onChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
            validE: this.validateField(this.state.electric),
            validH: this.validateField(this.state.heating),
            validG: this.validateField(this.state.gas),
            validR: this.validateField(this.state.rent),
            validW: this.validateField(this.state.water),
            showTicket: "ticketNone"
        });
// this.setState( { [name]: value,  emailValid: this.validateField(this.state.electric) });
        console.log("State, props", this.state, this.props.users);

        this.calculatePayment();
    }

    // validation
    validateField(value) {
        //|| h.length >= 2 || g.length >= 2 || r.length >= 2 || w.length >= 2)
        if ((+value + 1) > this.props.users[this.state.id].counterData[0].electric) {
            this.setState({validE: true});
            return true;
        }
        else return false;
    }

    selectUser(event) {
        var item = +event.target.attributes.getNamedItem("data-key").value;
        console.log("You clicked ", item, " Store: ", this.props.users);
        console.log("You clicked ", item, " Value---: ", event.target.value);
        this.setState({id: item});
    }

    selectOption(event) {
        console.log("You clicked ", " Store123: ", event.target.value);
        this.setState({id: +event.target.value});
        this.setState({message: "Введите показания!", showTicket: "ticketNone"});
    }

    printTicket(event) {
        window.print();
    }

    calculatePayment() {

        const storeCounterData = this.props.users[this.state.id].counterData[0];
        const storeTarifs = this.props.users[this.state.id].tarifs[0];
        let electricDataOld = storeCounterData.electric, heatingDataOld = storeCounterData.heating,
            gasDataOld = storeCounterData.gas, rentDataOld = storeCounterData.rent,
            waterDataOld = storeCounterData.water;
        let electricDataNew = this.state.electric, heatingDataNew = this.state.heating, gasDataNew = this.state.gas,
            rentDataNew = this.state.rent, waterDataNew = this.state.water;
        let electricTarif = storeTarifs.electric, heatingTarif = storeTarifs.heating, gasTarif = storeTarifs.gas,
            waterTarif = storeTarifs.water;
        let electricAmount = Math.abs(electricDataNew - electricDataOld) * electricTarif;
        let heatingAmount = Math.abs(heatingDataNew - heatingDataOld) * heatingTarif;
        let gasAmount = Math.abs(gasDataNew - gasDataOld) * gasTarif;
        let rentAmount = +this.rent.value; //this.props.users[this.state.id].tarifs[0].rent * this.props.users[this.state.id].counterData[0].rent;
        console.log('rentAmount', rentAmount);
        let waterAmount = Math.abs(waterDataNew - waterDataOld) * waterTarif;
        let summary = electricAmount + heatingAmount + gasAmount + rentAmount + waterAmount;
        var detail = `Quantity electric: ${ Math.abs(electricDataNew - electricDataOld) }. Cost: ${electricAmount} UAH!
                Quantity heating: ${ Math.abs(heatingDataNew - heatingDataOld) }. Cost: ${heatingAmount} UAH!
                Quantity gas: ${ Math.abs(gasDataNew - gasDataOld) }. Cost: ${gasAmount} UAH!
                Quantity rent: ${ Math.abs(rentDataNew - rentDataOld) }. Cost: ${rentAmount} UAH!
                Quantity water: ${ Math.abs(waterDataNew - waterDataOld) }. Cost: ${waterAmount} UAH!`;
        this.setState({
            ePayment: electricAmount.toFixed(2),
            hPayment: heatingAmount.toFixed(2),
            gPayment: gasAmount.toFixed(2),
            rPayment: rentAmount.toFixed(2),
            wPayment: waterAmount.toFixed(2),
            summaryMoney: summary.toFixed(2),
            ticket: detail
        });

    }

    render() {
        let ColorE = this.state.validE === true ? "lightgreen" : "pink";
        let ColorH = this.state.validH === true ? "lightgreen" : "pink";
        let ColorG = this.state.validG === true ? "lightgreen" : "pink";
        let ColorW = this.state.validW === true ? "lightgreen" : "pink";
        return (
            <div className="row">
                <p>
                    <select onChange={this.selectOption}>
                        <option disabled>Выберите жильца</option>
                        {this.props.users.map((user) => {
                            return (
                                <option
                                    data-key={user.id}
                                    key={user.id}
                                    value={user.id}

                                    onClick={this.selectUser}
                                >{user.counterData.electric} {user.userName}</option>
                            );
                        })}
                    </select>
                </p>
                <form className="sendData" id="print">
                    <p>Последний раз показания
                        отправлялись: {new Date(this.props.users[this.state.id].payment[0].date).toDateString()}</p>

                    <div><label htmlFor='electric'> Электричество (последние показания
                        счетчика): {this.props.users[this.state.id].counterData[0].electric} (КВт). </label>
                        <span>Введите новые показания:</span>
                        <input type="number" name='electric' value={this.state.electric} onChange={this.onChange}
                               style={{background: ColorE}}/></div>

                    <div><label htmlFor='heating'>Отопление (последние показания
                        счетчика): {this.props.users[this.state.id].counterData[0].heating} (гКал). </label>
                        <span>Введите новые показания:</span>
                        <input type="number" name='heating' value={this.state.heating} onChange={this.onChange}
                               style={{background: ColorH}}/></div>

                    <div><label htmlFor='gas'>Газ (последние показания
                        счетчика): {this.props.users[this.state.id].counterData[0].gas} (м3). </label>
                        <span>Введите новые показания:</span>
                        <input type="number" name='gas' value={this.state.gas} onChange={this.onChange}
                               style={{background: ColorG}}/></div>

                    <div><label htmlFor='water'>Вода (последние показания
                        счетчика): {this.props.users[this.state.id].counterData[0].water} (м3). </label>
                        <span>Введите новые показания:</span>
                        <input type="number" name='water' value={this.state.water} onChange={this.onChange}
                               style={{background: ColorW}}/></div>

                    <div><label htmlFor='rent'>Квартплата (жилая
                        площадь): {this.props.users[this.state.id].counterData[0].rent} (м2). </label>
                        <span></span>
                        <input disabled type="number" name='rent' ref={(valRent) => this.rent = valRent}
                               value={this.props.users[this.state.id].counterData[0].rent * this.props.users[this.state.id].tarifs[0].rent}
                               style={{background: 'lightgreen'}}/></div>


                    <button type='submit' className="btn-1e" onClick={this.send}> Отправить</button>
                    <h5 className="message">{this.state.message}</h5>
                </form>

                <div className={this.state.showTicket}>
                    <h4> Платежный документ №{Math.round(Math.random() * 10000)} </h4>
                    <h5> Получатель: р/с 123456789 БИК 123456 ФИЛИАЛ ОАО "БАНК" в г.Харьков <br/>
                        Плательщик: {this.props.users[this.state.id].userName}
                    </h5>
                    <span> Жилая площадь: {this.props.users[this.state.id].counterData[0].rent} м2</span>
                    <table className="ticketPrint">
                        <tbody>
                        <tr>
                            <th>Услуга (ед.измер.)</th>
                            <th>Тариф (грн)</th>
                            <th>Объем потреб. улсуги</th>
                            <th>Начислено (грн.)</th>
                            <th>Итого (грн.)</th>
                        </tr>
                        <tr>
                            <td>Электричество</td>
                            <td>{this.props.users[this.state.id].tarifs[0].electric}</td>
                            <td>{(this.state.ePayment / this.props.users[this.state.id].tarifs[0].electric).toFixed(0)}</td>
                            <td>{this.state.ePayment}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Отопление</td>
                            <td>{this.props.users[this.state.id].tarifs[0].heating}</td>
                            <td>{(this.state.hPayment / this.props.users[this.state.id].tarifs[0].heating).toFixed(0)}</td>
                            <td>{this.state.hPayment}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Газ</td>
                            <td>{this.props.users[this.state.id].tarifs[0].gas}</td>
                            <td>{(this.state.gPayment / this.props.users[this.state.id].tarifs[0].gas).toFixed(0)}</td>
                            <td>{this.state.gPayment}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Водоснабжение</td>
                            <td>{this.props.users[this.state.id].tarifs[0].water}</td>
                            <td>{(this.state.hPayment / this.props.users[this.state.id].tarifs[0].water).toFixed(0)}</td>
                            <td>{this.state.gPayment}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Квартплата</td>
                            <td>{this.props.users[this.state.id].tarifs[0].rent}</td>
                            <td>-</td>
                            <td>{this.state.rPayment}</td>
                            <td>{this.state.summaryMoney}</td>
                        </tr>
                        </tbody>
                    </table>
                    <p>Квитанция
                        сформирована: {new Date().getDate() + "-" + new Date(this.state.date).getMonth() + "-" + new Date(this.state.date).getFullYear() + " " + new Date().getHours() + ":" + new Date().getMinutes()} </p>
                    <img src={print} className="imgPrint" alt="print"/>
                    <button className="btn btn-info printBtn" onClick={this.printTicket}><i className="fa fa-print"
                                                                                            aria-hidden="true"></i>
                        Print
                    </button>
                </div>
            </div>
        );
    }
}


AddPayment = connect(mapStateToProps)(AddPayment);


class NotFound extends Component {
    render() {
        return <p className="not-found">&frasl;&frasl; 404 page not found...</p>;
    }
}


class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {id: 0, electric: "", heating: "", gas: "", rent: "", water: "", message: "",};
        this.onChange = this.onChange.bind(this);
        this.send = this.send.bind(this);
        this.selectOption = this.selectOption.bind(this);
    }

    send(event) {
        event.preventDefault();
        store.dispatch({
                type: 'CHANGE_TARIF',
                id: this.state.id,
                tarifs: [{
                    electric: this.state.electric,
                    heating: this.state.heating,
                    gas: this.state.gas,
                    rent: this.state.rent,
                    water: this.state.water
                }]
            }
        );
        this.setState({message: "Тарифы успешно приняты!!!"});

    }

    onChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: +value});
    }


    selectOption(event) {
        let userId = +event.target.value;
        let userTarif = this.props.users[userId].tarifs[0];
        this.setState({
            id: +event.target.value,
            electric: userTarif.electric,
            heating: userTarif.heating,
            gas: userTarif.gas,
            rent: userTarif.rent,
            water: userTarif.water,
            message: "Измените показания!"
        });
    }


    render() {
        return (
            <div>
                <h1> Выберите потребителя для смены тарифа</h1>

                <select onChange={this.selectOption}>
                    <option disabled>Выберите жильца</option>
                    {this.props.users.map((user) => {
                        return (
                            <option
                                key={user.id + 25}
                                value={user.id}
                            >{user.counterData.electric} {user.userName}</option>
                        );
                    })}
                </select>

                <form className="sendTarifs">
                    <div><label htmlFor='electric'> Электричество: </label>
                        <input type="range" min="1" max="10" step="0.01" name='electric' value={this.state.electric}
                               onChange={this.onChange} style={{background: "pink"}}/><span>{this.state.electric} грн/1 кВт </span>
                    </div>

                    <div><label htmlFor='Heating'>Отопление: </label>
                        <input type="range" min="1" max="10" step="0.01" name='heating' value={this.state.heating}
                               onChange={this.onChange} style={{background: "pink"}}/><span>{this.state.heating} грн/1 гКал</span>
                    </div>

                    <div><label htmlFor='gas'>Газ: </label>
                        <input type="range" min="1" max="10" step="0.01" name='gas' value={this.state.gas}
                               onChange={this.onChange} style={{background: "pink"}}/><span>{this.state.gas}
                            грн/1 м3</span></div>

                    <div><label htmlFor='water'>Водоснабжение: </label>
                        <input type="range" min="1" max="10" step="0.01" name='water' value={this.state.water}
                               onChange={this.onChange} style={{background: "pink"}}/><span>{this.state.water}
                            грн/1 м3</span></div>

                    <div><label htmlFor='rent'>Квартплата: </label>
                        <input type="range" min="1" max="10" step="0.01" name='rent' value={this.state.rent}
                               onChange={this.onChange} style={{background: "pink"}}/><span>{this.state.rent}
                            грн/1 м2</span></div>

                    <button type='submit' className="btn-1e" onClick={this.send}> Изменить</button>
                    <p className="message">{this.state.message}</p>
                </form>
            </div>
        );
    }
}

Settings = connect(mapStateToProps, matchDispatchToProps)(Settings);

//===================Main APP============================
class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <Router history={createHistory()}>
                        <div>
                            <NavMenu/>
                            <Switch>
                                <Route exact path="/" component={Main}/>
                                <Route path="/pay" component={AddPayment}/>
                                <Route path="/about" component={About}/>
                                <Route path="/settings" component={Settings}/>
                                <Redirect from="/qwerty" to="/main"/>
                                <Route component={NotFound}/>
                            </Switch>
                        </div>
                    </Router>
                    <Footer/>
                </div>
            </Provider>
        );
    }
}

export default App;