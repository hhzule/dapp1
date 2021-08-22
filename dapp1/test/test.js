const { assert } = require('chai')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })
  })
  describe('apis', async () => {
    let res, apiCount
    const hash = "abc123"

    before(async () => {
      res = await decentragram.createApi(hash, 'Api Description', { from: author })
      apiCount = await decentragram.apiCount()
    })

    it('create apis', async () => {
      //SUCCESS
      assert.equal(apiCount, 1)
      const event = res.logs[0].args
      assert.equal(event.id.toNumber(), apiCount.toNumber(), 'id is correct')
      assert.equal(event.hashes, hash, 'hash is correct')
      assert.equal(event.description, 'Api Description', 'description is correct')
      assert.equal(event.fund, '0', 'funds')
      assert.equal(event.developer, author, 'developer is correct')

      await decentragram.createApi('', 'Api Description', { from: author }).should.be.rejected;
      await decentragram.createApi('api hash', '', { from: author }).should.be.rejected;

   
    })

    it('lists apis', async () => {
      const api =  await decentragram.apis(apiCount)
      assert.equal(api.id.toNumber(), apiCount.toNumber(), 'id is correct')
      assert.equal(api.hashes, hash, 'hash is correct')
      assert.equal(api.description, 'Api Description', 'description is correct')
      assert.equal(api.fund, '0', 'fund is correct')
      assert.equal(api.developer, author, 'developer is correct')

    })
    it('allows users to fund api', async () => {
      // Track the author balance before purchase
      let oldDeveloperBalance
      oldDeveloperBalance = await web3.eth.getBalance(author)
      oldDeveloperBalance = new web3.utils.BN(oldDeveloperBalance)

      res = await decentragram.fundApi(apiCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

      // SUCCESS
      const event = res.logs[0].args
      // console.log(event)
      assert.equal(event.id.toNumber(), apiCount.toNumber(), 'id is correct')
      assert.equal(event.hashes, hash, 'Hash is correct')
      assert.equal(event.description, 'Api Description', 'description is correct')
      assert.equal(event.fund, '1000000000000000000', 'fund amount is correct')
      assert.equal(event.developer, author, 'author is correct')

      let newDeveloperBalance
      newDeveloperBalance = await web3.eth.getBalance(author)
      newDeveloperBalance = new web3.utils.BN(newDeveloperBalance)

      let fundApiOwner
      fundApiOwner = web3.utils.toWei('1', 'Ether')
      fundApiOwner = new web3.utils.BN(fundApiOwner)

      const expectedBalance = oldDeveloperBalance.add(fundApiOwner)

      assert.equal(newDeveloperBalance.toString(), expectedBalance.toString())

      await decentragram.fundApi(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    })
    
  })

})