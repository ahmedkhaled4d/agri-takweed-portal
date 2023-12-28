class Validate {
  /**
   * Validate Egyptian nationalId
   * @param {number|string} id - nationalId
   * @return {boolean}
   */
  isNationalIdValide(id) {
    let rgx =
      /^[23][4-9][0-9](?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])(?:01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d{5}$/;

    const isIdValide = rgx.test(id);
    return isIdValide;
  }

  /**
   * Validate TradeId
   * @param {number|string} id - tradeId
   * @return {boolean}
   */
  isTradeIdValide(id) {
    let rgx = /^\d+$/;

    const isIdValide = rgx.test(id);
    return isIdValide;
  }
  /**
   * Validate mobileNumber
   * @param {string} mobile - mobile Number
   * @return {boolean}
   */
  isMobileValide(mobile) {
    let rgx = /^01[0125][0-9]{8}$/;

    const isMobileValide = rgx.test(mobile);
    return isMobileValide;
  }
  /**
   * Validate mail
   * @param {string} mail - mail
   * @return {boolean}
   */
  isEmailValide(mail) {
    const rgx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const isMailValide = rgx.test(mail);
    return isMailValide;
  }
  /**
   * Validate name
   * @param {string} name - name
   * @return {boolean}
   */
  isNameValide(name) {
    const rgx = /^([a-zA-Zء-ي])+((\s[a-zA-Zء-ي]+)){1,}$/;

    const isNameValide = rgx.test(name);
    return isNameValide;
  }
}

const validate = new Validate();

export default validate;
