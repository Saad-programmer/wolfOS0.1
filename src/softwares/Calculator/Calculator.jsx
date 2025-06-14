import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator = () => {
  const operators = ["+", "-", "/", "*"];
  const [boxValue, setBoxValue] = useState('0');
  const [lastOperationHistory, setLastOperationHistory] = useState('');
  const [firstNum, setFirstNum] = useState(true);
  const [numbers, setNumbers] = useState([]);
  const [operatorValue, setOperatorValue] = useState(null);
  const [lastOperator, setLastOperator] = useState(null);
  const [calcOperator, setCalcOperator] = useState(null);
  const [lastButton, setLastButton] = useState(null);

  const calculate = (num1, num2, operator) => {
    let total;
    switch (operator) {
      case '+':
        total = parseFloat(num1) + parseFloat(num2);
        break;
      case '-':
        total = parseFloat(num1) - parseFloat(num2);
        break;
      case '*':
        total = parseFloat(num1) * parseFloat(num2);
        break;
      case '/':
        total = parseFloat(num1) / parseFloat(num2);
        break;
      default:
        total = boxValue;
    }
    if (!Number.isInteger(total)) {
      total = parseFloat(total.toPrecision(12));
    }
    return total;
  };

  const showSelectedOperator = (operator) => {
    const elements = document.getElementsByClassName('operator');
    Array.from(elements).forEach(element => {
      // Use Object.assign to avoid direct parameter reassignment
      Object.assign(element.style, { backgroundColor: '#e68a00' });
    });

    if (operator === '+') {
      Object.assign(document.getElementById('plusOp').style, { backgroundColor: '#ffd11a' });
    } else if (operator === '-') {
      Object.assign(document.getElementById('subOp').style, { backgroundColor: '#ffd11a' });
    } else if (operator === '*') {
      Object.assign(document.getElementById('multiOp').style, { backgroundColor: '#ffd11a' });
    } else if (operator === '/') {
      Object.assign(document.getElementById('divOp').style, { backgroundColor: '#ffd11a' });
    }
  };

  const buttonNumber = (button) => {
    setLastButton(button);

    if (!operators.includes(button) && button !== '=') {
      if (firstNum) {
        if (button === '.') {
          setBoxValue('0.');
        } else {
          setBoxValue(button);
        }
        setFirstNum(false);
        return;
      }

      if (boxValue.length === 1 && boxValue === '0') {
        if (button === '.') {
          setBoxValue(`${boxValue}.`);
        }
        return;
      }
      if (boxValue.includes('.') && button === '.') {
        return;
      }
      if (boxValue.length === 20) {
        return;
      }
      if (button === '.' && boxValue === '-') {
        setBoxValue('-0.');
      } else {
        setBoxValue(`${boxValue}${button}`);
      }
    } else {
      if (operatorValue !== null && button === operatorValue) {
        return;
      }
      if (button === '-' && boxValue === '0') {
        setBoxValue(button);
        setFirstNum(false);
        setOperatorValue(button);
        showSelectedOperator(button);
        return;
      }
      if (operators.includes(button) && boxValue === '-') {
        return;
      }
      if (button === '-' && operatorValue === '-' && lastOperationHistory.includes('=')) {
        return;
      }

      if (operators.includes(button)) {
        const lastOp = lastOperator || button;
        setLastOperator(lastOp === '*' ? '×' : lastOp === '/' ? '÷' : lastOp);
        setCalcOperator(lastOp);
        setOperatorValue(button);
        setFirstNum(true);
        showSelectedOperator(button);
      }

      if (numbers.length === 0) {
        setNumbers([...numbers, boxValue]);
        if (lastOperator) {
          setLastOperationHistory(`${boxValue} ${lastOperator}`);
        }
      } else {
        const [firstNumber] = numbers;
        let tempNum = boxValue;

        if (button === '=' && calcOperator) {
          const total = calculate(firstNumber, boxValue, calcOperator);
          setBoxValue(total.toString());

          if (!lastOperationHistory.includes('=')) {
            setLastOperationHistory(`${lastOperationHistory} ${boxValue} =`);
          }

          tempNum = firstNumber;
          setNumbers([total.toString()]);
          setOperatorValue(null);
          showSelectedOperator(null);

          const historyArr = lastOperationHistory.split(' ');
          historyArr[0] = tempNum;
          setLastOperationHistory(historyArr.join(' '));
        } else if (calcOperator) {
          setLastOperationHistory(`${tempNum} ${lastOperator}`);
          setCalcOperator(button);
          setNumbers([boxValue]);
        }
      }
    }
  };

  const buttonClear = () => {
    window.location.reload();
  };

  const backspaceRemove = () => {
    const elements = document.getElementsByClassName('operator');
    Array.from(elements).forEach(element => {
      Object.assign(element.style, { backgroundColor: '#e68a00' });
    });

    const lastNum = boxValue.slice(0, -1);
    setBoxValue(lastNum);

    if (lastNum.length === 0) {
      setBoxValue('0');
      setFirstNum(true);
    }
  };

  const plusMinus = () => {
    if (lastOperator !== undefined) {
      if (numbers.length > 0) {
        if (operators.includes(lastButton)) {
          if (boxValue === '-') {
            setBoxValue('0');
            setFirstNum(true);
            return;
          }
          setBoxValue('-');
          setFirstNum(false);
        } else {
          const newValue = (-parseFloat(boxValue)).toString();
          setBoxValue(newValue);
          const [firstNumber] = numbers;
          setNumbers([firstNumber, newValue]);
        }
      }
      return;
    }

    if (boxValue === '0') {
      setBoxValue('-');
      setFirstNum(false);
      return;
    }
    setBoxValue((-parseFloat(boxValue)).toString());
  };

  const squareRoot = () => {
    const squareNum = Math.sqrt(parseFloat(boxValue));
    setBoxValue(squareNum.toString());
    setNumbers([...numbers, squareNum]);
  };

  const divisionOne = () => {
    const squareNum = 1 / parseFloat(boxValue);
    setBoxValue(squareNum.toString());
    setNumbers([...numbers, squareNum]);
  };

  const powerOf = () => {
    const squareNum = parseFloat(boxValue) ** 2;
    setBoxValue(squareNum.toString());
    setNumbers([...numbers, squareNum]);
  };

  const calculatePercentage = () => {
    const elements = document.getElementsByClassName('operator');
    if (numbers.length > 0 && lastOperator !== undefined) {
      const percValue = (parseFloat(boxValue) / 100) * parseFloat(numbers[0]);
      setBoxValue(percValue.toFixed(2));
      setNumbers([...numbers, boxValue]);

      if (!lastOperationHistory.includes('=')) {
        setLastOperationHistory(`${lastOperationHistory} ${numbers[1]} =`);
      }
    } else {
      setBoxValue((parseFloat(boxValue) / 100).toString());
    }
    setNumbers([...numbers, boxValue]);
    const res = calculate(numbers[0], numbers[1], lastOperator);
    setBoxValue(res.toString());
    setOperatorValue('=');

    Array.from(elements).forEach(element => {
      Object.assign(element.style, { backgroundColor: '#e68a00' });
    });
  };

  const clearEntry = () => {
    if (numbers.length > 0 && lastOperator !== undefined) {
      setBoxValue('0');
      const [temp] = numbers;
      setNumbers([temp]);
      setFirstNum(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();
      const equal = '=';
      const dot = '.';

      if (e.key === 'Delete') {
        buttonClear();
        return;
      }

      const isNumber = !Number.isNaN(parseFloat(e.key));
      let enterPress;
      let dotPress;
      let commaPress = false;

      if (e.key === 'Enter') {
        enterPress = equal;
      }
      if (e.key === '.') {
        dotPress = dot;
      }
      if (e.key === ',') {
        commaPress = true;
      }

      if (isNumber || operators.includes(e.key) || e.key === 'Enter' || e.key === dotPress || commaPress || e.key === 'Backspace') {
        if (e.key === 'Enter') {
          buttonNumber(enterPress);
        } else if (e.key === 'Backspace') {
          Object.assign(document.getElementById('backspace_btn').style, { backgroundColor: '#999999' });
          backspaceRemove();
        } else if (commaPress) {
          buttonNumber(dot);
        } else {
          buttonNumber(e.key);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Backspace') {
        Object.assign(document.getElementById('backspace_btn').style, { backgroundColor: '#666666' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [boxValue, lastOperationHistory, firstNum, numbers, operatorValue, lastOperator, calcOperator, lastButton]);

  return (
    <div id="calculator">
      <h1>Calculator</h1>
      <p id="last_operation_history">{lastOperationHistory}</p>
      <p id="box" className="box">{boxValue}</p>
      <table id="table">
        <tbody>
          <tr>
            <td><button type="button" onClick={calculatePercentage}>%</button></td>
            <td><button type="button" onClick={clearEntry}>CE</button></td>
            <td><button type="button" onClick={buttonClear}>C</button></td>
            <td><button type="button" id="backspace_btn" onClick={backspaceRemove} aria-label="Backspace" /></td>
          </tr>
          <tr>
            <td><button type="button" onClick={divisionOne}>¹∕ₓ</button></td>
            <td><button type="button" onClick={powerOf}>x²</button></td>
            <td><button type="button" onClick={squareRoot}>√x</button></td>
            <td><button type="button" id="plusOp" className="operator" onClick={() => buttonNumber('+')}>+</button></td>
          </tr>
          <tr>
            <td><button type="button" onClick={() => buttonNumber('7')}>7</button></td>
            <td><button type="button" onClick={() => buttonNumber('8')}>8</button></td>
            <td><button type="button" onClick={() => buttonNumber('9')}>9</button></td>
            <td><button type="button" id="subOp" className="operator" onClick={() => buttonNumber('-')}>-</button></td>
          </tr>
          <tr>
            <td><button type="button" onClick={() => buttonNumber('4')}>4</button></td>
            <td><button type="button" onClick={() => buttonNumber('5')}>5</button></td>
            <td><button type="button" onClick={() => buttonNumber('6')}>6</button></td>
            <td><button type="button" id="multiOp" className="operator" onClick={() => buttonNumber('*')}>×</button></td>
          </tr>
          <tr>
            <td><button type="button" onClick={() => buttonNumber('1')}>1</button></td>
            <td><button type="button" onClick={() => buttonNumber('2')}>2</button></td>
            <td><button type="button" onClick={() => buttonNumber('3')}>3</button></td>
            <td><button type="button" id="divOp" className="operator" onClick={() => buttonNumber('/')}>÷</button></td>
          </tr>
          <tr>
            <td><button type="button" onClick={plusMinus}>±</button></td>
            <td><button type="button" onClick={() => buttonNumber('0')}>0</button></td>
            <td><button type="button" id="dot" onClick={() => buttonNumber('.')}>.</button></td>
            <td colSpan="4"><button type="button" className="operator" id="equal_sign" onClick={() => buttonNumber('=')}>=</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Calculator;
