import { Injectable } from '@angular/core';
import * as fcl from "@onflow/fcl"

@Injectable({
  providedIn: 'root'
})
export class FlowService {
  currentUser: any;
  
  constructor() { 
    fcl.config({
        "app.detail.title": "RecykleOnFlow",
        "accessNode.api": "https://rest-testnet.onflow.org",
        "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
      })
  }

  isWalletConnected() {
    return !!this.currentUser;
  }

  login() {
    fcl.authenticate();
    fcl.currentUser().subscribe((user: any) => {
        this.currentUser = user;
    })
  }

  logout() {
    fcl.unauthenticate();
    this.currentUser = null;
  }

  getCurrentUser() {
    return fcl.currentUser();
  }

  getFlowBalance(address: string) {
    try {
      fcl.query({
        cadence: `
                  import FlowToken from 0x7e60df042a9c0868
                  import FungibleToken from 0x9a0766d93b6608b7
    
                  pub fun main(address: Address): UFix64{
                    let balanceVault =  getAccount(address).getCapability(/public/flowTokenBalance).borrow<&FlowToken.Vault{FungibleToken.Balance}>()!
                    return balanceVault.balance
                  }`,
        args: (arg, t) => [arg(address, t.Address)],
      }).then((res) => {
        console.log(res);
      });
    } catch (error) {
      console.log("err:", error);
    }
  }

  async mintToken(
    name: String,
    description: String,
    thumbnail: String,) {
    try {
      await fcl.mutate({
        cadence: `
            import RecykleOnFlowTestnet from 0xf5b0e8db2da0b3e8
            import NonFungibleToken from 0x631e88ae7f1d7c20
            import MetadataViews from 0x631e88ae7f1d7c20

            transaction(name: String, description: String, thumbnail: String){
                let recipientCollection: &RecykleOnFlowTestnet.Collection{NonFungibleToken.CollectionPublic}
              
                prepare(signer: AuthAccount){
                    
                if signer.borrow<&RecykleOnFlowTestnet.Collection>(from: RecykleOnFlowTestnet.CollectionStoragePath) == nil {
                signer.save(<- RecykleOnFlowTestnet.createEmptyCollection(), to: RecykleOnFlowTestnet.CollectionStoragePath)
                signer.link<&RecykleOnFlowTestnet.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(RecykleOnFlowTestnet.CollectionPublicPath, target: RecykleOnFlowTestnet.CollectionStoragePath)
                }

                self.recipientCollection = signer.getCapability(RecykleOnFlowTestnet.CollectionPublicPath)
                                            .borrow<&RecykleOnFlowTestnet.Collection{NonFungibleToken.CollectionPublic}>()!
                }

                execute{
                  RecykleOnFlowTestnet.mintNFT(recipient: self.recipientCollection, name: name, description: description, thumbnail: thumbnail, royalties: [] as [MetadataViews.Royalty])
                }
            }
            `,
        args: (arg, t) => [arg(name, t.String), arg(description, t.String), arg(thumbnail, t.String)],
        limit: 9999,
      }).then((res) => {
        console.log(res);
        fcl.tx(res).subscribe((transaction) => {
          console.log(transaction);
          if (transaction.status === 4 && transaction.errorMessage === "") {
            console.log('NFT MINTED');
          }
        })
      });
      
    } catch (error) {
      console.log("err", error);
    }
  }
}