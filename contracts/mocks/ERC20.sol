//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC20 {
    mapping (address => uint256) _balances;
    mapping (address => mapping(address => uint256)) allowances;

    address immutable public owner;

    string private _name;
    string private _symbol;
    uint256 private _totalSupply;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
    }


    /*
     * EVENTS
     */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);


    /*
     * MODIFIERS
     */
    modifier onlyOwner {
        require(msg.sender == owner, "ERC20: only owner can call this function");
        _;
    }


    /*
     * FUNCTIONS
     */

    /**
     * @dev Returns the name of the token - e.g. "MyToken".
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token. E.g. “HIX”.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals the token uses - e.g. 8, means to divide the token
     * amount by 100000000 to get its user representation.
     */
    function decimals() public pure virtual returns(uint8) {
        return 18;
    }

    /**
     * @dev Returns the total token supply.
     */
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Returns the account balance of another account with address `_owner`.
     */
    function balanceOf(address _owner) public view virtual returns (uint256 balance) {
        return _balances[_owner];
    }

    function allowance(address _owner, address _spender) public view virtual returns (uint256 remaining) {
        return allowances[_owner][_spender];
    }

    /**
     * @dev Transfers `_value` amount of tokens to address `_to`.
     *
     * Emit an {Transfer} event.
     */
    function transfer(address _to, uint256 _value) public virtual returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * @dev Transfers `_value` amount of tokens from address `_from` to address `_to`.
     *
     * Emit an {Transfer} event.
     */
    function transferFrom(address _from, address _to, uint256 _value) public virtual returns (bool success) {
        require(allowances[_from][msg.sender] >= _value, "ERC20: insufficient allowance");

        allowances[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * @dev Allows `_spender` to withdraw from your account multiple times, up to the `_value` amount.
     * If this function is called again it overwrites the current allowance with `_value`.
     *
     * Emit an {Approval} event.
     */
    function approve(address _spender, uint256 _value) public virtual returns (bool success) {
        allowances[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal virtual {
        require(_from != address(0x0), "ERC20: from address can't be equal to zero");
        require(_to != address(0x0), "ERC20: to address can't be equal to zero");
        require(_balances[_from] >= _value, "ERC20: insufficient balance");

        _balances[_from] -= _value;
        _balances[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

    /**
     * @dev Creates `_amount` tokens and assigns them to `_account`, increasing the total supply.
     *
     * Emit an {Transfer} event.
     */
    function mint(address _account, uint256 _amount) public virtual onlyOwner {
        require(_account != address(0x0), "ERC20: address can't be equal to zero");

        _totalSupply += _amount;
        _balances[_account] += _amount;

        emit Transfer(address(0x0), _account, _amount);
    }

    /**
     * @dev Destroys `_amount` tokens from `_account`, reducing the total supply.
     *
     * Emit an {Transfer} event.
     */
    function burn(address _account, uint256 _amount) public virtual onlyOwner {
        require(_account != address(0x0), "ERC20: address can't be equal to zero");
        require(balanceOf(_account) >= _amount, "ERC20: insufficient balance");

        _totalSupply -= _amount;
        _balances[_account] -= _amount;

        emit Transfer(_account, address(0x0), _amount);
    }
}
