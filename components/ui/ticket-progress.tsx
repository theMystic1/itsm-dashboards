"use client";

import Image from "next/image";
import TicketLifecycleStepper from "./ticket-lifecycle";
import { LOCAL_ICONS } from "@/constants/icons";
import Text from "./text";
import { Column, EmptyUploader, FilePreview } from "../user/create-ticket";
import { activities, dummyTags, label } from "@/constants/constant";
import StatusItem from "./status";
import {
  formatDateProper,
  formatTo12Hour,
  humanSize,
  tokenizeMentions,
} from "@/lib/helpers";
import TogleSlide from "./toggle-slide";
import { Suspense, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { FiFilePlus } from "react-icons/fi";
import { IoAttachOutline, IoCloseCircle } from "react-icons/io5";
import Button from "./custom-btn";
import { BsChat } from "react-icons/bs";
import { BiCheckCircle } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";
import { Activity, User } from "@/types/type";

const TicketProgressInfo = () => {
  const [slide, setSlide] = useState("Description");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  return (
    <div className="w-full h-full  gap-5">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 relative border rounded-full">
            <Image src={LOCAL_ICONS.vectorIcon} fill alt="Vector" />
          </div>

          <Text.Paragraph className="font-semibold">
            Progress lifecycle
          </Text.Paragraph>
        </div>
        <div className="input-container !px-1">
          <TicketLifecycleStepper activeIndex={3} />
        </div>
      </div>

      <Column title="ISSUE: System update failed">
        <div className="grid grid-2 w-[80%] ">
          {dummyTags?.map((tag, i) => {
            return (
              <div key={i} className="flex items-center gap-5">
                <Text.Paragraph className="font-semibold text-sm">
                  {tag.title}
                </Text.Paragraph>

                {tag.type === "status" ? (
                  <StatusItem status="resolved" name={tag.value?.toString()} />
                ) : tag.type === "text" ? (
                  <Text.Paragraph className="text-sm">
                    {tag.value as string}
                  </Text.Paragraph>
                ) : tag.type === "date" ? (
                  `${formatTo12Hour(tag.value as Date)}, ${formatDateProper(
                    tag.value as Date
                  )}`
                ) : tag.type === "underline" ? (
                  <Text.LinkText className="text-sm">
                    {tag.value as string}
                  </Text.LinkText>
                ) : tag.type === "user" ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src={tag?.value?.image}
                      height={24}
                      width={24}
                      alt="Image alt"
                      className="rounded-full"
                    />
                    <Text.Paragraph className="text-sm">
                      {tag.value?.name as string}
                    </Text.Paragraph>
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </Column>

      <div className="my-5 flex flex-col gap-5">
        <Suspense>
          <TogleSlide
            slides={["Description", "Comments (5)", "Activities"]}
            activeSlide={slide}
            onSlideChange={(sl) => setSlide(sl)}
          />
        </Suspense>

        {slide?.toLowerCase().includes("comments") ? (
          <Comments />
        ) : slide?.toLowerCase().includes("description") ? (
          <Description
            text={description}
            onChangeText={(txt) => setDescription(txt)}
          />
        ) : (
          <ActivitiesTimeline />
        )}
      </div>

      <Column>
        <div className="flex items-center gap-2">
          <IoAttachOutline size={24} />
          <Text.Paragraph className="font-semibold !text-sm">
            Attachments {files.length > 0 ? `(${files.length})` : ""}
          </Text.Paragraph>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="py-2">
          {files.length === 0 ? (
            <EmptyUploader onClick={handleAttachClick} />
          ) : (
            <div className="grid grid-3 gap-2">
              {
                files.map((file, i) => (
                  <FilePreview
                    key={i}
                    file={file}
                    remove={() =>
                      setFiles((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    deletAble={false}
                  />
                )) // you can map through the files state to show previews
              }
              <button
                className="p-2 w-16 border border-gray-400 rounded-lg flex-row-center"
                onClick={handleAttachClick}
              >
                <PiPlus size={32} />
              </button>
            </div>
          )}
        </div>
      </Column>

      <div className="flex-1 flex flex-col justify-end min-h-20">
        <div className="grid-3 gap-2">
          <Button variant="secondary_2">
            <Button.Icon>
              <BsChat size={20} />
            </Button.Icon>
            <Button.Text>Add a comment</Button.Text>
          </Button>
          <Button variant="secondary_2">
            <Button.Icon>
              <FiFilePlus size={20} />
            </Button.Icon>
            <Button.Text>Upload a file</Button.Text>
          </Button>
          <Button disabled>
            <Button.Icon>
              <BiCheckCircle size={20} />
            </Button.Icon>
            <Button.Text>Close Ticket</Button.Text>
          </Button>
        </div>
      </div>
      <div className="h-10" />
    </div>
  );
};
export default TicketProgressInfo;

export const Description = ({
  text,
  onChangeText,
}: {
  text: string;
  onChangeText: (txt: string) => void;
}) => {
  return (
    <textarea
      className="input-container  resize-none  focus:ring-primary-500 py-2"
      placeholder="descriptions"
      rows={3}
      value={text}
      onChange={(e) => onChangeText(e.target.value)}
    />
  );
};

const Comments = () => {
  const [text, setText] = useState("");
  const targetRef = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const scrollToTarget = () => {
    // Add mention (collapse double mentions if needed)
    setText((prev) => (prev.startsWith("@bassey") ? prev : `@bassey ${prev}`));

    // Wait a tick so state updates are reflected, then scroll & focus
    requestAnimationFrame(() => {
      const el = targetRef.current;
      if (!el) return;

      // If you have a fixed header, give the target some scroll margin:
      // className="scroll-mt-20" on the textarea (or CSS: scroll-margin-top)
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });

      // Focus & put caret at end
      el.focus();
      const pos = el.value.length;
      el.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="input-container !bg-gray-100 py-2 !text-black  focus:ring-primary-500 ">
        <textarea
          ref={targetRef} // <-- attach the ref
          className="scroll-mt-20 h-full w-full  resize-none focus:none ring-0 border-0 focus:outline-none"
          placeholder="Thanks a lot! I look forward to hearing about the progress."
          rows={3}
          id="comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            {files.length > 0 ? (
              <>
                {files?.map((file, i) => (
                  <FileItem
                    file={file}
                    remove={() =>
                      setFiles((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    key={i}
                  />
                ))}
                <button onClick={handleAttachClick}>
                  <IoAttachOutline size={24} />
                </button>
              </>
            ) : (
              <button onClick={handleAttachClick}>
                <IoAttachOutline size={24} />
              </button>
            )}
            <Button>Publish</Button>
          </div>
        </div>
      </div>

      {/* Example list */}
      {[1, 3, 4, 5].map((n) => (
        <CommentItem key={n} onOpenReply={scrollToTarget} />
      ))}
    </div>
  );
};

type Reaction = { id: string; emoji: string; count: number };
type ReactionsMap = Record<string, Reaction>;

export const CommentItem = ({ onOpenReply }: { onOpenReply: () => void }) => {
  const [reactions, setReactions] = useState<ReactionsMap>({});
  const [open, setOpen] = useState(false);

  const addReaction = (e: EmojiClickData) => {
    const id = e.unified.toLowerCase(); // stable per emoji (+ skin tone)
    const emoji = e.emoji; // the native char to render
    setReactions((prev) => {
      const curr = prev[id];
      const nextCount = (curr?.count ?? 0) + 1;
      return { ...prev, [id]: { id, emoji, count: nextCount } };
    });
    setOpen(false);
  };

  const changeCount = (id: string, delta: number) =>
    setReactions((prev) => {
      const curr = prev[id];
      if (!curr) return prev;
      const next = Math.max(0, curr.count + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = { ...curr, count: next };
      return copy;
    });

  // sort by count desc, then emoji
  const reactionList = useMemo(
    () =>
      Object.values(reactions).sort(
        (a, b) => b.count - a.count || a.emoji.localeCompare(b.emoji)
      ),
    [reactions]
  );

  return (
    <div className="input-container py-2">
      <div className="flex items-center gap-3">
        <Image
          src="https://randomuser.me/api/portraits/men/75.jpg"
          height={24}
          width={24}
          alt="avatar"
          className="rounded-full"
        />
        <Text.Paragraph className="!text-sm font-semibold">
          John Doe
        </Text.Paragraph>
        <div className="h-1 w-1 rounded-full bg-gray-500" />
        <Text.SmallText className="!text-xs text-gray-500">
          {dayjs().subtract(20, "minute")?.toString() || "20m ago"}
        </Text.SmallText>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <MentionText
          text="Thanks a lot! @bassey I look forward to hearing about the progress."
          onMentionClick={(name) => console.log("Go to profile:", name)}
          mentionClassName="bg-primary-400/20 text-primary-500 rounded px-1"
        />
      </div>

      {/* Reactions row */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer p-1  rounded-full inline-flex items-center gap-2 text-sm"
          title="Add reaction"
        >
          <GrEmoji />
        </button>

        {reactionList.map((r) => (
          <ReactionBtn
            key={r.id}
            count={r.count}
            onClick={(ev) => changeCount(r.id, ev.altKey ? -1 : +1)} // Alt/Option = decrement
            title={evHelp}
          >
            <span className="text-base leading-none">{r.emoji}</span>
          </ReactionBtn>
        ))}

        <ReactionBtn count={0} onClick={onOpenReply} title="Add reply">
          <span className="text-base leading-none">Reply</span>
        </ReactionBtn>
      </div>

      {/* Picker */}
      <EmojiPicker
        open={open}
        onEmojiClick={addReaction}
        skinTonesDisabled
        searchDisabled={false}
        lazyLoadEmojis
      />
    </div>
  );
};

const evHelp = "Click: +1 • Alt/Option+Click: -1";

export const ReactionBtn = ({
  children,
  onClick,
  count = 0,
  title,
}: {
  children: React.ReactNode;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  count: number;
  title?: string;
}) => {
  return (
    <button
      title={title}
      className="cursor-pointer px-2 py-1 border rounded-full inline-flex items-center gap-2 text-sm"
      onClick={onClick}
    >
      {children}
      {count > 0 && <span className="min-w-4 text-xs">{count}</span>}
    </button>
  );
};

export function MentionText({
  text,
  onMentionClick,
  className = "",
  mentionClassName = "bg-yellow-100 text-yellow-800 rounded px-1",
}: {
  text: string;
  onMentionClick?: (name: string) => void;
  className?: string;
  mentionClassName?: string; // customize bg/text styles here
}) {
  const parts = useMemo(() => tokenizeMentions(text), [text]);

  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.type === "mention" ? (
          <button
            key={i}
            type="button"
            className={`inline px-1 align-baseline ${mentionClassName} text-sm`}
            onClick={onMentionClick ? () => onMentionClick(p.value) : undefined}
            title={`@${p.value}`}
          >
            {p.raw}
          </button>
        ) : (
          <span key={i}>{p.value}</span>
        )
      )}
    </span>
  );
}

const FileItem = ({ remove, file }: { remove: () => void; file: File }) => {
  return (
    <div className="p-2 !rounded-tl-2xl rounded-lg border border-gray-400 relative">
      <button
        className="absolute -top-2 -right-2 text-gray-500 cursor-pointer"
        onClick={remove}
      >
        <IoCloseCircle size={20} />
      </button>

      <div>
        {/* <CgFile size={32} /> */}
        <Text.Paragraph className="text-sm text-primary-500  font-semibold">
          {(file.type?.split("/")[1] ?? "FILE").toUpperCase()}
        </Text.Paragraph>
        <Text.Paragraph className="text-xs text-gray-400">
          {humanSize(file.size)}
        </Text.Paragraph>
      </div>
    </div>
  );
};

// ——— Small header line (no avatar here) ———
const ActorHeader = ({
  user,
  action,
}: {
  user: User;
  action: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="font-medium text-neutral-400">{user.name}</span>
    <span className="text-neutral-400">{action}</span>
  </div>
);

// ——— Timeline item: avatar column + rail that runs INTO the avatar ———
const TimelineItem = ({
  children,
  user,
  first = false,
  last = false,
}: {
  children: React.ReactNode;
  user: User;
  first?: boolean;
  last?: boolean;
}) => (
  <li className="relative grid grid-cols-[48px_1fr] gap-4">
    {/* Left column: rail + avatar */}
    <div className="relative flex items-start justify-center">
      {/* top half of rail (to avatar center) */}
      {!first && (
        <span
          aria-hidden
          className="absolute left-1/2 top-0 bottom-1/2 w-px bg-neutral-700 -translate-x-1/2"
        />
      )}
      {/* bottom half of rail (from avatar center) */}
      {!last && (
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 bottom-0 w-px bg-neutral-700 -translate-x-1/2"
        />
      )}

      {/* Avatar sits exactly over the rail center */}
      <Image
        src={user.avatarUrl}
        alt={user.name}
        width={36}
        height={36}
        className="relative z-10 h-9 w-9 rounded-full ring-2 ring-black/5 bg-neutral-900 object-cover translate-y-1"
      />
    </div>

    {/* Right column: content */}
    <div className="pb-8">{children}</div>
  </li>
);

// ===== Renderers (unchanged API; just swap ActorLine → ActorHeader and pass `user` to TimelineItem) =====
function StatusChangeRow(a: Extract<Activity, { type: "status_change" }>) {
  return (
    <div className="space-y-2">
      <ActorHeader
        user={a.actor}
        action={
          <>
            changed status to{" "}
            <span className="text-neutral-400">“{label[a.to]}”</span>
          </>
        }
      />
      <div className="text-xs text-neutral-500">
        {dayjs(a.at).format("MMM D, YYYY [at] HH:mm")}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <StatusItem status={a.from} name={label[a.from]} dot />
        <span className="text-neutral-500">→</span>
        <StatusItem status={a.to} name={label[a.to]} dot />
      </div>
    </div>
  );
}

function CommentRow(a: Extract<Activity, { type: "comment" }>) {
  return (
    <div className="space-y-2">
      <ActorHeader
        user={a.actor}
        action={
          <>
            commented on{" "}
            <span className="text-neutral-300">Ticket {a.ticketId}</span>
          </>
        }
      />
      <div className="text-xs text-neutral-700">
        {dayjs(a.at).format("MMM D, YYYY [at] HH:mm")}
      </div>
      <div className="mt-2 rounded-lg border border-neutral-500 bg-neutral-300/20 px-4 py-3 text-sm text-neutral-700">
        {a.text}
      </div>
    </div>
  );
}

function TicketCreatedRow(a: Extract<Activity, { type: "ticket_created" }>) {
  return (
    <div className="space-y-2">
      <ActorHeader
        user={a.actor}
        action={
          <>
            created a new ticket{" "}
            <span className="text-neutral-300">Ticket {a.ticketId}</span>
          </>
        }
      />
      <div className="text-xs text-neutral-500">
        {dayjs(a.at).format("MMM D, YYYY [at] HH:mm")}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <StatusItem status={a.initial} name={label[a.initial]} dot />
        <span className="text-neutral-500">→</span>
        <StatusItem status={a.next} name={label[a.next]} dot />
      </div>
    </div>
  );
}

// ===== Public component: pass `user` into TimelineItem so rail connects into avatar =====
export function ActivitiesTimeline() {
  return (
    <section aria-labelledby="activities-heading" className="w-full max-w-5xl">
      <h2 id="activities-heading" className="sr-only">
        Activities
      </h2>

      <ol role="list" className="relative mt-4">
        {activities.map((a, idx) => {
          const first = idx === 0;
          const last = idx === activities.length - 1;

          return (
            <TimelineItem key={a.id} user={a.actor} first={first} last={last}>
              {a.type === "status_change" && <StatusChangeRow {...a} />}
              {a.type === "comment" && <CommentRow {...a} />}
              {a.type === "ticket_created" && <TicketCreatedRow {...a} />}
            </TimelineItem>
          );
        })}
      </ol>
    </section>
  );
}
