import io, {Socket} from 'socket.io-client';
import {getCurrentUser} from "../../../entities/User/model/selectors/userSelectors";
import {useSelector} from "react-redux";
import {Fragment, useEffect, useRef, useState} from "react";
import {HStack, VStack} from "../../../shared/ui/Stack";
import {Input} from "../../../shared/ui/Input";
import {Button} from "../../../shared/ui/Button";
import {Bet, GameResult, GameState, NewGame} from "../model/types/types";
import {Card} from "../../../shared/ui/Card";
import {Text} from "../../../shared/ui/Text";
import {useAppDispatch} from "../../../shared/hooks/useAppDispatch/useAppDispatch";
import {addUserBalance, subUserBalance} from "../../../entities/User/model/slices/userSlice";
import Timer from "../../../shared/ui/Timer/Timer";
import {Avatar} from "../../../shared/ui/Avatar";

export const Roulette = () => {
    const user = useSelector(getCurrentUser)
    const dispatch = useAppDispatch()
    const socketRef = useRef<null | Socket>(null);
    const [bank, setBank] = useState(0)
    const [phase, setPhase] = useState<'betting' | 'spin'>('betting')
    const [betSize, setBetSize] = useState(0)
    const [timer, setTimer] = useState<number | null>(null)
    const [bets, setBets] = useState<Bet[]>([])
    const [hash, setHash] = useState('')
    const [number, setNumber] = useState<number | null>()
    const [winTicket, setWinTicket] = useState<number | null>(null)
    const [timeRemaining, setTimeRemaining] = useState<number>(10);

    useEffect(() => {
        let intervalId: number = 0;


        if (timer !== null) {
            intervalId = setInterval(() => {
                setTimeRemaining(Math.max(0, Math.floor(10 + (timer - Date.now() ) / 1000 ))); // Ограничиваем время не меньше 0
            }, 1000); // Обновление каждую секунду
        }

        return () => clearInterval(intervalId);
    }, [timer]);
    // const startTimer = () => {
    //     if(timer) {
    //         console.log('timer', timer)
    //         setInterval(() => {
    //             const currentTime = Date.now();
    //             setSeconds(timer - currentTime)
    //         }, 1000)
    //     }
    // }
    useEffect(() => {
        let socket: Socket | null = null
        if (user) {
            socket = io(import.meta.env.VITE_SERVICE_API_URL, {
                extraHeaders: {
                    Authorization: `${localStorage.getItem('access_token')}`,
                },
                query: {id: user.id}
            })
            socketRef.current = socket

            socket.on('newGame', (message: NewGame) => {
                setHash(message.hash)
                setPhase('betting')
                setTimer(message.close_time)
                setBets([])
                setNumber(null)
                setBank(0)
                setWinTicket(null)
            });
            socket.on('betPlaced', (message: Bet) => {
                setBets(prev => [...prev, message])
                setBank(prev => prev + message.amount)
                if (message.user.user_id === user.id) {
                    dispatch(subUserBalance(message.amount))
                }
            });
            socket.on('serverState', (message: GameState) => {
                setPhase(message.phase)
                setBets(message.bets)
                setHash(message.hash)
                setBank(message.bets.reduce((acc, cur) => acc + cur.amount, 0))
            });
            socket.on('startTimer', (message: { close_time: number }) => {
                setTimer(message.close_time)
                // startTimer()
            });
            socket.on('bettingPhaseEnded', message => {
                setPhase('spin')
            });
            socket.on('gameResult', (message: GameResult) => {
                if (message.user.user_id === user.id) {
                    dispatch(addUserBalance(message.win_amount))
                }
                setNumber(message.number)
                setWinTicket(message.win_ticket)
            });
        }
        return () => {
            if (socket)
                socket.disconnect();
        };
    }, [])

    const handleBet = () => {
        if (socketRef.current && user && user.balance >= betSize) {
            socketRef.current.emit('newBet', {id: user.id, amount: betSize, bet_time: Date.now()})
        }
    }
    return (<>
        <Card>
            <Text text={`Хэш SHA256 ${hash}`}/>
            <Text text={`Ожидаем ставки`}/>
            <Text text={`Банк ${bank}`}/>
            {timer && <Text text={`Таймер: ${timeRemaining}`}/>}            {/*<Timer timestamp={timer}/>*/}
            {number && <Text text={`Число раунда ${number}`}/>}
            {winTicket && <Text text={`Выйграл билет: ${winTicket}`}/>}
        </Card>
        <VStack gap={'24'} align={'center'}>
            <HStack key={'e'}>
                <Input type={'number'} onChange={(value) => setBetSize(Number(value))} value={betSize}/>
                <Button disabled={phase === 'spin'} onClick={handleBet}>Bet</Button>
            </HStack>

            {bets.length > 0 && bets.map((bet) => <Fragment key={bet.bet_time}>
                <Card>
                    <HStack align={'center'} gap={'32'}>
                        <Avatar size={50} src={bet.user.avatar_url}/>
                        <Text text={`${bet.user.nickname}`} />
                        <Text text={`Ставка: ${bet.amount}`} />
                        <Text text={`Билеты: ${bet.tickets[0]} - ${bet.tickets[1]}`} />
                    </HStack>
                </Card>
            </Fragment>)
            }
        </VStack>

    </>)
}
