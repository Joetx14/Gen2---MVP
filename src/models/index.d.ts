import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";





type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
  };
  readonly id: string;
  readonly email: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly isActive?: boolean | null;
  readonly lastLogin?: string | null;
  readonly farewellPlans?: (FarewellPlan | null)[] | null;
  readonly collaborations?: (Collaborator | null)[] | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
  };
  readonly id: string;
  readonly email: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly isActive?: boolean | null;
  readonly lastLogin?: string | null;
  readonly farewellPlans: AsyncCollection<FarewellPlan>;
  readonly collaborations: AsyncCollection<Collaborator>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerFarewellPlan = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FarewellPlan, 'id'>;
  };
  readonly id: string;
  readonly title: string;
  readonly user?: User | null;
  readonly basicInformation?: string | null;
  readonly farewellCeremony?: string | null;
  readonly farewellCare?: string | null;
  readonly farewellCareDetails?: string | null;
  readonly restingPlace?: string | null;
  readonly tributes?: string | null;
  readonly collaborators?: (Collaborator | null)[] | null;
  readonly isSharedWithCollaborators?: boolean | null;
  readonly shareCode?: string | null;
  readonly isComplete?: boolean | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly userFarewellPlansId?: string | null;
}

type LazyFarewellPlan = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FarewellPlan, 'id'>;
  };
  readonly id: string;
  readonly title: string;
  readonly user: AsyncItem<User | undefined>;
  readonly basicInformation?: string | null;
  readonly farewellCeremony?: string | null;
  readonly farewellCare?: string | null;
  readonly farewellCareDetails?: string | null;
  readonly restingPlace?: string | null;
  readonly tributes?: string | null;
  readonly collaborators: AsyncCollection<Collaborator>;
  readonly isSharedWithCollaborators?: boolean | null;
  readonly shareCode?: string | null;
  readonly isComplete?: boolean | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly userFarewellPlansId?: string | null;
}

export declare type FarewellPlan = LazyLoading extends LazyLoadingDisabled ? EagerFarewellPlan : LazyFarewellPlan

export declare const FarewellPlan: (new (init: ModelInit<FarewellPlan>) => FarewellPlan) & {
  copyOf(source: FarewellPlan, mutator: (draft: MutableModel<FarewellPlan>) => MutableModel<FarewellPlan> | void): FarewellPlan;
}

type EagerCollaborator = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Collaborator, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email: string;
  readonly role?: string | null;
  readonly status?: string | null;
  readonly farewellPlan?: FarewellPlan | null;
  readonly user?: User | null;
  readonly planOwnerId: string;
  readonly userId?: string | null;
  readonly invitedAt: string;
  readonly respondedAt?: string | null;
  readonly lastAccessedAt?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userCollaborationsId?: string | null;
  readonly farewellPlanCollaboratorsId?: string | null;
}

type LazyCollaborator = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Collaborator, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email: string;
  readonly role?: string | null;
  readonly status?: string | null;
  readonly farewellPlan: AsyncItem<FarewellPlan | undefined>;
  readonly user: AsyncItem<User | undefined>;
  readonly planOwnerId: string;
  readonly userId?: string | null;
  readonly invitedAt: string;
  readonly respondedAt?: string | null;
  readonly lastAccessedAt?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userCollaborationsId?: string | null;
  readonly farewellPlanCollaboratorsId?: string | null;
}

export declare type Collaborator = LazyLoading extends LazyLoadingDisabled ? EagerCollaborator : LazyCollaborator

export declare const Collaborator: (new (init: ModelInit<Collaborator>) => Collaborator) & {
  copyOf(source: Collaborator, mutator: (draft: MutableModel<Collaborator>) => MutableModel<Collaborator> | void): Collaborator;
}

type EagerPromoCode = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PromoCode, 'id'>;
  };
  readonly id: string;
  readonly code: string;
  readonly isValid?: boolean | null;
  readonly usageLimit?: number | null;
  readonly usedCount?: number | null;
  readonly expiresAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyPromoCode = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PromoCode, 'id'>;
  };
  readonly id: string;
  readonly code: string;
  readonly isValid?: boolean | null;
  readonly usageLimit?: number | null;
  readonly usedCount?: number | null;
  readonly expiresAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type PromoCode = LazyLoading extends LazyLoadingDisabled ? EagerPromoCode : LazyPromoCode

export declare const PromoCode: (new (init: ModelInit<PromoCode>) => PromoCode) & {
  copyOf(source: PromoCode, mutator: (draft: MutableModel<PromoCode>) => MutableModel<PromoCode> | void): PromoCode;
}