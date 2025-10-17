-- CreateTable
CREATE TABLE "public"."GameState" (
    "wallet" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isWithdrawalBlocked" BOOLEAN NOT NULL DEFAULT false,
    "isShadowbanned" BOOLEAN NOT NULL DEFAULT false,
    "starterPackClaimed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GameState_pkey" PRIMARY KEY ("wallet")
);

-- CreateTable
CREATE TABLE "public"."ShopItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "buffData" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "config" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerStat" (
    "id" SERIAL NOT NULL,
    "userWallet" TEXT NOT NULL,
    "totalTokensProduced" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxLevelReached" INTEGER NOT NULL DEFAULT 1,
    "weeklyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inventory" (
    "id" SERIAL NOT NULL,
    "userWallet" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prestige" (
    "id" SERIAL NOT NULL,
    "userWallet" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "prestigeLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prestige_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Expedition" (
    "id" SERIAL NOT NULL,
    "userWallet" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "missionType" TEXT NOT NULL,
    "rewardToken" TEXT NOT NULL,
    "rewardAmount" DOUBLE PRECISION NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "rewardClaimed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expedition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketListing" (
    "id" SERIAL NOT NULL,
    "sellerWallet" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "pricePerUnitInVIDA" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GlobalEvent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetToken" TEXT NOT NULL,
    "goalAmount" DOUBLE PRECISION NOT NULL,
    "currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "rewardItemId" TEXT NOT NULL,
    "rewardAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GlobalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventContribution" (
    "id" SERIAL NOT NULL,
    "userWallet" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Referral" (
    "id" SERIAL NOT NULL,
    "referrer" TEXT NOT NULL,
    "referred" TEXT NOT NULL,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAchievement" (
    "id" SERIAL NOT NULL,
    "userWallet" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WithdrawTransaction" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "signature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WithdrawTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DepositTransaction" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepositTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rewardNft" (
    "id" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "isAwarded" BOOLEAN NOT NULL DEFAULT false,
    "ownerWallet" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rewardNft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NftMintPool" (
    "contractAddress" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "rarity" TEXT NOT NULL,
    "isMinted" BOOLEAN NOT NULL DEFAULT false,
    "mintedTo" TEXT,
    "mintedAt" TIMESTAMP(3),

    CONSTRAINT "NftMintPool_pkey" PRIMARY KEY ("contractAddress","tokenId")
);

-- CreateTable
CREATE TABLE "public"."AirdropClaim" (
    "id" SERIAL NOT NULL,
    "userWallet" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AirdropClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Nft" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "rarity" TEXT NOT NULL,
    "ownerWallet" TEXT,

    CONSTRAINT "Nft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStat_userWallet_key" ON "public"."PlayerStat"("userWallet");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_userWallet_itemId_key" ON "public"."Inventory"("userWallet", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Prestige_userWallet_roomId_key" ON "public"."Prestige"("userWallet", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Expedition_contractAddress_tokenId_key" ON "public"."Expedition"("contractAddress", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referred_key" ON "public"."Referral"("referred");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userWallet_achievementId_key" ON "public"."UserAchievement"("userWallet", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawTransaction_signature_key" ON "public"."WithdrawTransaction"("signature");

-- CreateIndex
CREATE UNIQUE INDEX "DepositTransaction_signature_key" ON "public"."DepositTransaction"("signature");

-- CreateIndex
CREATE UNIQUE INDEX "rewardNft_tokenId_key" ON "public"."rewardNft"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "rewardNft_contractAddress_tokenId_key" ON "public"."rewardNft"("contractAddress", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "AirdropClaim_userWallet_key" ON "public"."AirdropClaim"("userWallet");

-- CreateIndex
CREATE UNIQUE INDEX "Nft_tokenId_key" ON "public"."Nft"("tokenId");

-- AddForeignKey
ALTER TABLE "public"."EventContribution" ADD CONSTRAINT "EventContribution_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."GlobalEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
