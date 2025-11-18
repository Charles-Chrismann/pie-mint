import { Injectable } from '@nestjs/common';
import { ilike } from 'drizzle-orm';
import { subscription_tier_features_table, subscriptions_table } from '@repo/db';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class SubscriptionsService {

  constructor(
    private drizzle: DrizzleService
  ) { }


  async getAllSubscriptions() {
    const features = await this.drizzle.client
      .query.subscription_tier_features_table.findMany({
        columns: {
          id: true,
          index: true,
          name: true,
          description: true,
        }
      })

    const results = await this.drizzle.client.query.subscriptions_table.findMany({
      columns: {
        id: true,
        name: true,
      },
      with: {
        action_level: true,
        subscription_tiers: {
          columns: {
            id: true,
            name: true
          },
          with: {
            subscription_tiers__subscription_tier_features: {
              columns: {
                is_included: true,
                subscription_tier_feature_id: true,
              }
              // with: {
              //   subscription_tier_feature: true
              // }
            }
          }
        }
      }
    })

    return results.map(r => ({
      id: r.id,
      name: r.name,
      action_level: r.action_level,

      tiers: r.subscription_tiers.map(st => ({
        id: st.id,
        name: st.name,
        features: st.subscription_tiers__subscription_tier_features.map(ststf => ({
          is_included: ststf.is_included,
          ...features.find(f => f.id === ststf.subscription_tier_feature_id)
        }))
      }))
    }))
  }

  async getSubscriptionByName(name: string) {
    // Récupération de toutes les features
    const features = await this.drizzle.client
      .query.subscription_tier_features_table.findMany({
        columns: {
          id: true,
          index: true,
          name: true,
          description: true,
        }
      });

    // Recherche de la subscription par nom (case-insensitive)
    const subscription = await this.drizzle.client.query.subscriptions_table.findFirst({
      where: ilike(subscriptions_table.name, name),
      columns: {
        id: true,
        name: true,
      },
      with: {
        action_level: true,
        subscription_tiers: {
          columns: {
            id: true,
            name: true
          },
          with: {
            subscription_tiers__subscription_tier_features: {
              columns: {
                is_included: true,
                subscription_tier_feature_id: true,
              }
            }
          }
        }
      }
    });

    if (!subscription) return null;

    // Reconstruction des données comme dans getAllSubscriptions
    return {
      id: subscription.id,
      name: subscription.name,
      action_level: subscription.action_level,

      tiers: subscription.subscription_tiers.map(st => ({
        id: st.id,
        name: st.name,
        features: st.subscription_tiers__subscription_tier_features.map(ststf => ({
          is_included: ststf.is_included,
          ...features.find(f => f.id === ststf.subscription_tier_feature_id)
        }))
      }))
    };
  }
}
