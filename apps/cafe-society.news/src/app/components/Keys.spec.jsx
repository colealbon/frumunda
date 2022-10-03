import { Suspense } from 'react';
import '@testing-library/jest-dom'
import Keys from './Keys'
import { render, screen, act } from '@testing-library/react';
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.get(
    'https://gaia.blockstack.org/hub/16quNqKF5auLBgo5txqWHDKhXMur4ERd5u/keys',
    (req, res, ctx) => {
      return res(
        ctx.delay(100),
        ctx.json({"iv":"4441cfe56a7da26a69b6573d8f9c3b6c","ephemeralPK":"031dc766b56e0c773b1a847fd2f8952e46791c6ba4c4b6bdeb271efd025b967626","cipherText":"f22a03628628a4c35226a4e975e24e05d2701b5378d53de5e240ad4de0929dd27715812a037c75839ab7f81bdf1a8138d4a94680c45e917b7f904cf812218707130bc9c2cf9d0abf3776475a1dd6fdc8575f520df72b4709a2b4e5f0112e1c4f6d386a809fe702777d942c86fdb775420bad62830fe982459e4acdba624b910d821ce2ea4a558bf5994f56fd50c03e8ed3f79ee7dbe99605b1762b5850d214753790e34c66bff2cbf8dd89993d0cca90be604ceb9ff7f25222122d1d1aba6508e3bddf9509f3b45e286cab78213a1413ccb6548ade119676024d51faaab952a975c64256ef6f8396edfc2ba86462411c019ef6c7037002760f9c0caeb17875bcef912f153240dd3615c397a268ba5b5d48bfd87ba17eb17972c8c8bdf1a1af9e954e3e48d9119538016035aeaecfae5314955ef9a8290bde0620764a4c2af6bf92045a1c4655eb4624b11ea373725bca70ca3d4c7902f96be765277ab48a7c8a7c6f1eecc24064ae19ee8794afed3c450dc600b5d7e8d3a0fb66241e461b03de777213a9aacd33e5e5fcfe3dd14f58ac64d588517084115574c5ee4bca3b761e6b732515db198f0c3a9a19c37d1b851427f76f9dbe194d984ed06ba46d89239d5e971f551039fb3dd10874ad6cd9b3ac59b5d6e0445ada1aba5cee899613370efbbe0bd3d0c85193b1ec911fbcd0eb7fd0e7388c39e23f09c3461fc32beee5c51c2a13b5f665638ceac776eda0d32c80d7a3126f8e522890e124037bd552f8ee7146a5c046bd9968b3121af31fd71a4eae2503283556a4b2731b5208c5368d195427d45c625cbcbd132d1b17b2f8112fd2806b10ff7f419787a5070c073a5efb46ed167b1e6936de51f3212b11b4c4fc","mac":"d437cb5a958338ecf00f92d916bb7bb390d7086b93b7805f626317efe7483d94","wasString":true})
      )
    }
  )
);

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('Keys', () => {
  describe('Keys component', () => {
    beforeEach(async () => {
      await act(async () => await render(<Suspense fallback={'loading'}><Keys /></Suspense>))
    })
    it ('renders key label control', () => {
      const target = screen.getByPlaceholderText('key label');
      expect(target).toBeInTheDocument()
    })
    it ('renders public key control', () => {
      const target = screen.getByPlaceholderText('public key curve25519_pk');
      expect(target).toBeInTheDocument()
    })
    it ('renders secret key control', () => {
      const target = screen.getByPlaceholderText('secret key curve25519_sk');
      expect(target).toBeInTheDocument()
    })
    it ('renders reset keys button', () => {
      const target = screen.getByText('reset keys');
      expect(target).toBeInTheDocument()
    })
    it ('renders stuff from storage', async () => {
      expect(await screen.findByText('lucky-day')).toBeVisible()
    })

  });
});