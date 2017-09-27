import { Email } from 'meteor/email';
import { Random } from 'meteor/random';
import { Invites } from './Invites';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Seasons } from '/imports/api/seasons/Seasons';

export const sendInvite = new ValidatedMethod({
  name: 'invites.send',
  validate({ email, slug }) {},
  run({ seasonName, email, slug }) {
    if (Meteor.isServer) {
      const token = Random.hexString(8);

      const subject = `You've been invited to a BEVS Season!`;
      const sender = Meteor.users.findOne(this.userId);
      const emailTemplate = `${sender.profile
        .name} invited you to join a BEVS Season, ${seasonName}.
    
To join the season, please click the link below:
https://bevs.beer/invite/${token}`;

      // send email
      Email.send({
        from: 'invites@bevs.beer',
        to: email,
        subject,
        html: emailTemplate
      });
      // add to Invites collection
      Invites.insert({ email, slug, token });
    }
  }
});

export const acceptInvite = new ValidatedMethod({
  name: 'invites.accept',
  validate({ slug, token }) {
    const inviteExists = Invites.findOne({ slug, token });
    if (!inviteExists) {
      throw new Meteor.Error(
        'invalid-invite',
        "Invite for this season doesn't exist"
      );
    }
  },
  run({ slug, token }) {
    Meteor.users.update(this.userId, {
      $addToSet: {
        seasons: { slug }
      }
    });
    Invites.remove({ token });
  }
});

export const declineInvite = new ValidatedMethod({
  name: 'invites.decline',
  validate: null,
  run({ token }) {
    Invites.remove({ token });
  }
});
