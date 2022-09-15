const initialState = {
  items: {},
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "wheel": {
      return {
        ...state,
        items: action.payload,
      };
    }

    case "COIN": {
      return {
        ...state,
        coin: action.payload,
      };
    }

    case "PLAY": {
      return {
        ...state,
        play: action.payload,
      };
    }

    case "SET_TARGET": {
      return {
        ...state,
        starget: action.payload,
      };
    }

    case "ROWS": {
      return {
        ...state,
        rows: action.payload,
      };
    }

    case "RISK": {
      return {
        ...state,
        risk: action.payload,
      };
    }

    case "CHART_COIN": {
      return {
        ...state,
        chart_coin: action.payload,
      };
    }

    case "CHAT_NAME": {
      return {
        ...state,
        name: action.payload,
      };
    }

    case "CHAT_COUNTRY": {
      return {
        ...state,
        country: action.payload,
      };
    }

    case "CHAT_GIF": {
      return {
        ...state,
        gif: action.payload,
      };
    }

    case "TARGET_USER": {
      return {
        ...state,
        target: action.payload,
      };
    }

    case "HIDE_BET": {
      return {
        ...state,
        bet: action.payload,
      };
    }

    case "SET_CLASSIC_DICE_RESULT": {
      return {
        ...state,
        classic_dice_result: action.payload,
      };
    }

    case "CRASH_WINNER_TEXT": {
      return {
        ...state,
        profit: action.payload,
      };
    }

    case "CRASH_IM_IN_GAME": {
      return {
        ...state,
        im_in_game: action.payload,
      };
    }

    case "NUMBERS_OF_LANDS": {
      return {
        ...state,
        lands: action.payload,
      };
    }

    case "SET_MODAL": {
      return {
        ...state,
        modal: action.payload,
      };
    }

    case "SET_PLAY_WHEEL": {
      return {
        ...state,
        play_wheel: action.payload,
      };
    }

    case "SET_BET": {
      return {
        ...state,
        bets: action.payload,
      };
    }

    case "FORCE_MODAL": {
      return {
        ...state,
        force_modal: action.payload,
      };
    }

    case "SIDEBAR_DISPLAY": {
      return {
        ...state,
        sidebar_display: action.payload,
      };
    }

    case "SET_BOMB_WIRE": {
      return {
        ...state,
        wire: action.payload,
      };
    }

    case "CURRENT_CREDIT": {
      return {
        ...state,
        credit: action.payload,
      };
    }

    case "GET_WALLET": {
      return {
        ...state,
        get_wallet: action.payload,
      };
    }

    case "GET_AUTH": {
      return {
        ...state,
        get_auth: action.payload,
      };
    }

    case "CLASSIC_DICE_SET_RANGE": {
      return {
        ...state,
        classic_dice_payout: action.payload,
      };
    }

    case "CLASSIC_DICE_SET_CHANCE": {
      return {
        ...state,
        classic_dice_chance: action.payload,
      };
    }

    case "CLASSIC_DICE_SET_TYPE": {
      return {
        ...state,
        classic_dice_type: action.payload,
      };
    }

    case "ROULETTE_NUMBER": {
      return {
        ...state,
        selected_number: action.payload,
      };
    }

    default:
      return state;
  }
}

export default rootReducer;
